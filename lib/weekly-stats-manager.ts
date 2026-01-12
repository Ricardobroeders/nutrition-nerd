import { supabase } from './supabase';
import { getMonday, formatDate } from './streak-utils';

/**
 * Backfill weekly stats for a user based on their intake history
 * This should be run once to populate historical weekly stats
 */
export async function backfillWeeklyStats(userId: string) {
  try {
    // Get all user intake
    const { data: allIntake, error: intakeError } = await supabase
      .from('user_intake')
      .select('intake_date, food_item_id')
      .eq('user_id', userId)
      .order('intake_date', { ascending: true });

    if (intakeError || !allIntake || allIntake.length === 0) {
      console.error('Error fetching intake or no data:', intakeError);
      return;
    }

    // Get earliest and latest dates
    const earliestDate = new Date(allIntake[0].intake_date);
    const latestDate = new Date(allIntake[allIntake.length - 1].intake_date);

    // Generate all weeks from earliest to latest
    const weeks = new Map<string, Set<string>>();

    for (const intake of allIntake) {
      const intakeDate = new Date(intake.intake_date);
      const weekStart = getMonday(intakeDate);
      const weekStartStr = formatDate(weekStart);

      if (!weeks.has(weekStartStr)) {
        weeks.set(weekStartStr, new Set());
      }
      weeks.get(weekStartStr)!.add(intake.food_item_id);
    }

    // Upsert all weekly stats
    const weeklyStatsToInsert = Array.from(weeks.entries()).map(([weekStart, itemIds]) => ({
      user_id: userId,
      week_start_date: weekStart,
      unique_items_count: itemIds.size,
    }));

    const { error: upsertError } = await supabase
      .from('weekly_stats')
      .upsert(weeklyStatsToInsert, {
        onConflict: 'user_id,week_start_date',
      });

    if (upsertError) {
      console.error('Error upserting weekly stats:', upsertError);
      return;
    }

    console.log(`Backfilled ${weeklyStatsToInsert.length} weeks of stats for user ${userId}`);

    // Now update user streaks based on weekly stats
    await updateUserStreaksFromWeeklyStats(userId);

  } catch (error) {
    console.error('Error in backfillWeeklyStats:', error);
  }
}

/**
 * Update user's current_streak and longest_streak based on their weekly_stats
 */
export async function updateUserStreaksFromWeeklyStats(userId: string) {
  try {
    // Get all weekly stats for user
    const { data: weeklyStats, error } = await supabase
      .from('weekly_stats')
      .select('week_start_date, unique_items_count')
      .eq('user_id', userId)
      .order('week_start_date', { ascending: false });

    if (error || !weeklyStats) {
      console.error('Error fetching weekly stats:', error);
      return;
    }

    // Calculate current streak (from most recent week backwards)
    let currentStreak = 0;
    for (const stat of weeklyStats) {
      if (stat.unique_items_count >= 25) {
        currentStreak++;
      } else {
        break; // Stop at first week that didn't meet goal
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;

    // Reverse to go chronologically
    for (const stat of weeklyStats.reverse()) {
      if (stat.unique_items_count >= 25) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Update user record
    const { error: updateError } = await supabase
      .from('users')
      .update({
        current_streak: currentStreak,
        longest_streak: longestStreak,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user streaks:', updateError);
      return;
    }

    console.log(`Updated streaks for user ${userId}: current=${currentStreak}, longest=${longestStreak}`);
  } catch (error) {
    console.error('Error in updateUserStreaksFromWeeklyStats:', error);
  }
}

/**
 * Ensure the current week's stats are up to date for a user
 * Should be called when the user loads the app or adds/removes items
 */
export async function ensureCurrentWeekStats(userId: string) {
  try {
    const now = new Date();
    const weekStart = getMonday(now);
    const weekStartStr = formatDate(weekStart);

    // Get current week's intake
    const { data: weekIntake, error } = await supabase
      .from('user_intake')
      .select('food_item_id')
      .eq('user_id', userId)
      .gte('intake_date', weekStartStr);

    if (error) {
      console.error('Error fetching week intake:', error);
      return;
    }

    const uniqueItems = new Set(weekIntake?.map(i => i.food_item_id) || []);

    // Upsert this week's stats
    const { error: upsertError } = await supabase
      .from('weekly_stats')
      .upsert({
        user_id: userId,
        week_start_date: weekStartStr,
        unique_items_count: uniqueItems.size,
      }, {
        onConflict: 'user_id,week_start_date',
      });

    if (upsertError) {
      console.error('Error upserting current week stats:', upsertError);
    }

    // Update streaks
    await updateUserStreaksFromWeeklyStats(userId);
  } catch (error) {
    console.error('Error in ensureCurrentWeekStats:', error);
  }
}
