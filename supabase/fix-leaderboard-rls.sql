-- Fix RLS policies to allow leaderboard to show all users' totals
-- Run this in Supabase SQL Editor

-- Step 1: Drop all existing SELECT policies for user_intake and weekly_stats
DROP POLICY IF EXISTS "Users can read own intake" ON public.user_intake;
DROP POLICY IF EXISTS "Users can read own stats" ON public.weekly_stats;
DROP POLICY IF EXISTS "Authenticated users can read all intake" ON public.user_intake;
DROP POLICY IF EXISTS "Authenticated users can read all stats" ON public.weekly_stats;

-- Step 2: Create new policies that allow authenticated users to read ALL records
-- This is needed for the leaderboard to calculate and display all users' totals

-- Allow authenticated users to read all user_intake records (for all-time leaderboard)
CREATE POLICY "Authenticated users can read all intake" ON public.user_intake
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to read all weekly_stats records (for weekly streaks leaderboard)
CREATE POLICY "Authenticated users can read all stats" ON public.weekly_stats
  FOR SELECT TO authenticated USING (true);

-- Note: INSERT, UPDATE, and DELETE policies remain restrictive
-- Users can only modify their own data, but can view everyone's data for the leaderboard
