# Weekly Stats & Streak Fix

## Problem
The `weekly_stats` table was empty and user streaks were not being updated because:
1. The functions `updateWeeklyStats()` and `updateUserStreak()` existed but were never called
2. No automatic calculation or storage of weekly statistics was happening
3. Week resets didn't trigger any database updates

## Solution

### 1. Real-time Updates (Going Forward)
Modified the intake page to automatically update weekly stats whenever a user adds or removes items:

**Changed Files:**
- `app/(protected)/intake/page.tsx` - Now calls `updateWeeklyStats()` after adding/removing items

**How it works:**
- When you add a food item, the app calculates this week's unique items count and saves it to `weekly_stats`
- When you remove a food item, it recalculates and updates
- Stats are updated in real-time as you use the app

### 2. Backfill Historical Data (One-time Fix)
Created a script to populate all historical weekly stats based on existing intake data:

**New Files:**
- `scripts/backfill-weekly-stats.ts` - Script to process all historical data
- `lib/weekly-stats-manager.ts` - Utility functions for managing weekly stats

## How to Fix Your Database

### Step 1: Run the Backfill Script
This will populate all historical weekly stats and calculate your streaks:

```bash
npm run backfill-stats
```

The script will:
1. Fetch all users from the database
2. For each user, group their intake by week
3. Calculate unique items count for each week
4. Insert/update records in `weekly_stats` table
5. Calculate current_streak and longest_streak
6. Update the users table with correct streak values

### Step 2: Verify the Results
After running the script, check:
1. The `weekly_stats` table should now have records for each week you've logged food
2. Your user profile should show correct `current_streak` and `longest_streak` values
3. The Klassement (leaderboard) should now show weekly streaks for all users

## What Happens Now

**Automatic Updates:**
- Every time you add or remove food items, weekly stats are automatically updated
- Streaks are NOT automatically updated yet (this requires a scheduled job)

**Manual Streak Updates:**
- Run `npm run backfill-stats` anytime to recalculate streaks based on current weekly_stats

## Future Improvements

To fully automate streak updates, you could:
1. Add a cron job or Supabase Edge Function that runs weekly (Monday at midnight)
2. Call `updateUserStreaksFromWeeklyStats()` for all users
3. This would automatically update streaks when weeks change

## Testing

To test the fix:
1. Run the backfill script: `npm run backfill-stats`
2. Add a new food item in the app
3. Check the `weekly_stats` table - you should see an updated record for this week
4. Remove the food item
5. Check again - the count should decrease

## Notes

- The script is safe to run multiple times (it uses UPSERT)
- It only updates weekly_stats and user streaks, doesn't modify intake data
- Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` to run
