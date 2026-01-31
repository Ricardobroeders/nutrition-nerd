/**
 * Backfill Weekly Stats Script
 *
 * This script backfills weekly_stats table and updates user streaks
 * based on historical user_intake data.
 *
 * Run with: npx tsx scripts/backfill-weekly-stats.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const daysToSubtract = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - daysToSubtract);
  return d;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function backfillWeeklyStatsForUser(userId: string, displayName: string) {
  console.log(`\nProcessing user: ${displayName} (${userId})`);

  // Get all user intake
  const { data: allIntake, error: intakeError } = await supabase
    .from('user_intake')
    .select('intake_date, food_item_id')
    .eq('user_id', userId)
    .order('intake_date', { ascending: true });

  if (intakeError) {
    console.error(`  Error fetching intake:`, intakeError);
    return;
  }

  if (!allIntake || allIntake.length === 0) {
    console.log(`  No intake data found`);
    return;
  }

  console.log(`  Found ${allIntake.length} intake records`);

  // Group by week
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

  console.log(`  Calculated stats for ${weeks.size} weeks`);

  // Prepare weekly stats records
  const weeklyStatsToInsert = Array.from(weeks.entries()).map(([weekStart, itemIds]) => ({
    user_id: userId,
    week_start_date: weekStart,
    unique_items_count: itemIds.size,
  }));

  // Upsert all weekly stats
  const { error: upsertError } = await supabase
    .from('weekly_stats')
    .upsert(weeklyStatsToInsert, {
      onConflict: 'user_id,week_start_date',
    });

  if (upsertError) {
    console.error(`  Error upserting weekly stats:`, upsertError);
    return;
  }

  console.log(`  ✓ Inserted/updated ${weeklyStatsToInsert.length} weekly stat records`);

  // Calculate and update streaks
  await updateUserStreaks(userId, displayName);
}

async function updateUserStreaks(userId: string, displayName: string) {
  // Get all weekly stats for user
  const { data: weeklyStats, error } = await supabase
    .from('weekly_stats')
    .select('week_start_date, unique_items_count')
    .eq('user_id', userId)
    .order('week_start_date', { ascending: false });

  if (error || !weeklyStats) {
    console.error(`  Error fetching weekly stats:`, error);
    return;
  }

  // Calculate current streak (from most recent week backwards)
  let currentStreak = 0;
  for (const stat of weeklyStats) {
    if (stat.unique_items_count >= 30) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;

  for (const stat of weeklyStats.slice().reverse()) {
    if (stat.unique_items_count >= 30) {
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
    console.error(`  Error updating user streaks:`, updateError);
    return;
  }

  console.log(`  ✓ Updated streaks: current=${currentStreak}, longest=${longestStreak}`);
}

async function main() {
  console.log('='.repeat(60));
  console.log('Backfilling Weekly Stats and Streaks');
  console.log('='.repeat(60));

  // Get all users
  const { data: users, error } = await supabase
    .from('users')
    .select('id, display_name, email');

  if (error) {
    console.error('Error fetching users:', error);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.log('No users found');
    process.exit(0);
  }

  console.log(`Found ${users.length} user(s)\n`);

  // Process each user
  for (const user of users) {
    await backfillWeeklyStatsForUser(user.id, user.display_name || user.email);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Backfill complete!');
  console.log('='.repeat(60));
}

main().catch(console.error);
