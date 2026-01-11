-- Nutrition Nerd Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food items table
CREATE TABLE IF NOT EXISTS public.food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_nl TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('fruit', 'groente')),
  category TEXT,
  nutrient TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User intake table
CREATE TABLE IF NOT EXISTS public.user_intake (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE NOT NULL,
  intake_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, food_item_id, intake_date)
);

-- Weekly stats table
CREATE TABLE IF NOT EXISTS public.weekly_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  unique_items_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_intake_user_id ON public.user_intake(user_id);
CREATE INDEX IF NOT EXISTS idx_user_intake_date ON public.user_intake(intake_date);
CREATE INDEX IF NOT EXISTS idx_user_intake_food_item ON public.user_intake(food_item_id);
CREATE INDEX IF NOT EXISTS idx_weekly_stats_user_id ON public.weekly_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_stats_week ON public.weekly_stats(week_start_date);
CREATE INDEX IF NOT EXISTS idx_food_items_type ON public.food_items(type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Anyone can read food items" ON public.food_items;
DROP POLICY IF EXISTS "Users can read own intake" ON public.user_intake;
DROP POLICY IF EXISTS "Users can insert own intake" ON public.user_intake;
DROP POLICY IF EXISTS "Users can delete own intake" ON public.user_intake;
DROP POLICY IF EXISTS "Users can read own stats" ON public.weekly_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.weekly_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.weekly_stats;
DROP POLICY IF EXISTS "Users can read all users for leaderboard" ON public.users;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read all users for leaderboard" ON public.users
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for food_items table
CREATE POLICY "Anyone can read food items" ON public.food_items
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for user_intake table
CREATE POLICY "Users can read own intake" ON public.user_intake
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own intake" ON public.user_intake
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own intake" ON public.user_intake
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for weekly_stats table
CREATE POLICY "Users can read own stats" ON public.weekly_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON public.weekly_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.weekly_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on weekly_stats table
DROP TRIGGER IF EXISTS update_weekly_stats_updated_at ON public.weekly_stats;
CREATE TRIGGER update_weekly_stats_updated_at
  BEFORE UPDATE ON public.weekly_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.food_items TO authenticated;
GRANT ALL ON public.user_intake TO authenticated;
GRANT ALL ON public.weekly_stats TO authenticated;
