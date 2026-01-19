import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}

// Helper function to get user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
  return data;
}

// Helper function to sign in with Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
  }
  return { data, error };
}

// Helper function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
  }
  return { error };
}

// Helper function to get all food items
export async function getFoodItems() {
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .order('name_nl', { ascending: true });

  if (error) {
    console.error('Error getting food items:', error);
    return [];
  }
  return data || [];
}

// Helper function to add intake
export async function addIntake(userId: string, foodItemId: string, intakeDate: string) {
  const { data, error } = await supabase
    .from('user_intake')
    .insert({
      user_id: userId,
      food_item_id: foodItemId,
      intake_date: intakeDate,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding intake:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

// Helper function to get user intake
export async function getUserIntake(userId: string, startDate?: string, endDate?: string) {
  let query = supabase
    .from('user_intake')
    .select(`
      *,
      food_item:food_items(*)
    `)
    .eq('user_id', userId)
    .order('intake_date', { ascending: false });

  if (startDate) {
    query = query.gte('intake_date', startDate);
  }
  if (endDate) {
    query = query.lte('intake_date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error getting user intake:', error);
    return [];
  }
  return data || [];
}

// Helper function to remove intake
export async function removeIntake(intakeId: string) {
  const { error } = await supabase
    .from('user_intake')
    .delete()
    .eq('id', intakeId);

  if (error) {
    console.error('Error removing intake:', error);
  }
  return { error };
}

// Helper function to get weekly stats
export async function getWeeklyStats(userId: string) {
  const { data, error } = await supabase
    .from('weekly_stats')
    .select('*')
    .eq('user_id', userId)
    .order('week_start_date', { ascending: false });

  if (error) {
    console.error('Error getting weekly stats:', error);
    return [];
  }
  return data || [];
}

// Helper function to update weekly stats
export async function updateWeeklyStats(
  userId: string,
  weekStartDate: string,
  uniqueItemsCount: number
) {
  const { data, error } = await supabase
    .from('weekly_stats')
    .upsert({
      user_id: userId,
      week_start_date: weekStartDate,
      unique_items_count: uniqueItemsCount,
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating weekly stats:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

// Helper function to update user streak
export async function updateUserStreak(
  userId: string,
  currentStreak: number,
  longestStreak: number
) {
  const { data, error } = await supabase
    .from('users')
    .update({
      current_streak: currentStreak,
      longest_streak: longestStreak,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user streak:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

// Helper function to update user display name
export async function updateUserDisplayName(userId: string, displayName: string) {
  const { data, error } = await supabase
    .from('users')
    .update({
      display_name: displayName,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating display name:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

// Helper function to get all-time leaderboard (total unique items)
export async function getAllTimeLeaderboard() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      display_name,
      user_intake(food_item_id)
    `)
    .order('display_name', { ascending: true });

  if (error) {
    console.error('Error getting all-time leaderboard:', error);
    return [];
  }

  // Calculate unique items count for each user
  const leaderboard = data.map(user => {
    const uniqueItems = new Set(user.user_intake.map(intake => intake.food_item_id));
    return {
      id: user.id,
      display_name: user.display_name,
      total_unique_items: uniqueItems.size,
    };
  });

  // Sort by total unique items descending
  return leaderboard.sort((a, b) => b.total_unique_items - a.total_unique_items);
}

// Helper function to get average weekly items leaderboard
export async function getAverageWeeklyLeaderboard() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      display_name,
      weekly_stats(unique_items_count, week_start_date)
    `)
    .order('display_name', { ascending: true });

  if (error) {
    console.error('Error getting average weekly leaderboard:', error);
    return [];
  }

  // Get current week's Monday to exclude it from average calculation
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const currentDay = now.getDay();
  const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
  const currentMonday = new Date(now);
  currentMonday.setDate(currentMonday.getDate() - daysToSubtract);

  const year = currentMonday.getFullYear();
  const month = String(currentMonday.getMonth() + 1).padStart(2, '0');
  const day = String(currentMonday.getDate()).padStart(2, '0');
  const currentWeekStart = `${year}-${month}-${day}`;

  // Calculate average unique items per week for each user (excluding current week)
  const leaderboard = data.map(user => {
    // Filter out the current week
    const completedWeeks = user.weekly_stats.filter(
      week => week.week_start_date !== currentWeekStart
    );

    const totalItems = completedWeeks.reduce((sum, week) => sum + week.unique_items_count, 0);
    const average = completedWeeks.length > 0 ? totalItems / completedWeeks.length : 0;
    return {
      id: user.id,
      display_name: user.display_name,
      average_weekly_items: parseFloat(average.toFixed(2)),
      weeks_tracked: completedWeeks.length,
    };
  });

  // Sort by average descending
  return leaderboard.sort((a, b) => b.average_weekly_items - a.average_weekly_items);
}

// Helper function to get weekly streaks leaderboard
// A streak counts consecutive completed weeks (Monday-Sunday) where user achieved 30+ unique items
// The current week (still in progress) is excluded from streak calculations
export async function getWeeklyStreaksLeaderboard() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      display_name,
      weekly_stats(unique_items_count, week_start_date)
    `)
    .order('display_name', { ascending: true });

  if (error) {
    console.error('Error getting weekly streaks leaderboard:', error);
    return [];
  }

  // Get current week's Monday to exclude it (week still in progress)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const currentDay = now.getDay();
  const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
  const currentMonday = new Date(now);
  currentMonday.setDate(currentMonday.getDate() - daysToSubtract);
  const year = currentMonday.getFullYear();
  const month = String(currentMonday.getMonth() + 1).padStart(2, '0');
  const day = String(currentMonday.getDate()).padStart(2, '0');
  const currentWeekStart = `${year}-${month}-${day}`;

  // Calculate current streak for each user (consecutive completed weeks with 30+ items)
  const leaderboard = data.map(user => {
    // Filter out the current week (still in progress) and sort by date descending
    const completedWeeks = user.weekly_stats
      .filter(week => week.week_start_date !== currentWeekStart)
      .sort((a, b) => new Date(b.week_start_date).getTime() - new Date(a.week_start_date).getTime());

    // Calculate current streak from most recent completed week backwards
    // Check for consecutive weeks (7 days apart)
    let currentStreak = 0;
    let previousWeekStart: Date | null = null;

    for (const week of completedWeeks) {
      if (week.unique_items_count >= 30) {
        const weekStart = new Date(week.week_start_date);

        // Check if this week is consecutive to the previous one
        if (previousWeekStart === null) {
          // First qualifying week
          currentStreak = 1;
        } else {
          // Check if exactly 7 days apart (consecutive weeks)
          const daysDiff = (previousWeekStart.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24);
          if (daysDiff === 7) {
            currentStreak++;
          } else {
            // Gap in weeks, stop counting
            break;
          }
        }
        previousWeekStart = weekStart;
      } else {
        // Week with < 30 items breaks the streak
        break;
      }
    }

    return {
      id: user.id,
      display_name: user.display_name,
      weeks_completed: currentStreak,
    };
  });

  // Sort by weeks completed descending
  return leaderboard.sort((a, b) => b.weeks_completed - a.weeks_completed);
}

// Helper function to get weekly highscore leaderboard (current week only)
export async function getWeeklyHighscoreLeaderboard() {
  // Get current week's Monday
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const currentDay = now.getDay();
  const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
  const currentMonday = new Date(now);
  currentMonday.setDate(currentMonday.getDate() - daysToSubtract);
  const year = currentMonday.getFullYear();
  const month = String(currentMonday.getMonth() + 1).padStart(2, '0');
  const day = String(currentMonday.getDate()).padStart(2, '0');
  const currentWeekStart = `${year}-${month}-${day}`;

  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      display_name,
      weekly_stats(unique_items_count, week_start_date)
    `)
    .order('display_name', { ascending: true });

  if (error) {
    console.error('Error getting weekly highscore leaderboard:', error);
    return [];
  }

  // Get current week's unique items for each user
  const leaderboard = data.map(user => {
    const currentWeekStats = user.weekly_stats.find(
      week => week.week_start_date === currentWeekStart
    );
    return {
      id: user.id,
      display_name: user.display_name,
      weekly_items: currentWeekStats?.unique_items_count || 0,
    };
  });

  // Sort by weekly items descending
  return leaderboard.sort((a, b) => b.weekly_items - a.weekly_items);
}
