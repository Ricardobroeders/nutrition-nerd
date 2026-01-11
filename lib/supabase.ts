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

// Helper function to get weekly streaks leaderboard
export async function getWeeklyStreaksLeaderboard() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      display_name,
      weekly_stats(unique_items_count)
    `)
    .order('display_name', { ascending: true });

  if (error) {
    console.error('Error getting weekly streaks leaderboard:', error);
    return [];
  }

  // Count weeks where user achieved 25+ unique items
  const leaderboard = data.map(user => {
    const weeksCompleted = user.weekly_stats.filter(
      week => week.unique_items_count >= 25
    ).length;
    return {
      id: user.id,
      display_name: user.display_name,
      weeks_completed: weeksCompleted,
    };
  });

  // Sort by weeks completed descending
  return leaderboard.sort((a, b) => b.weeks_completed - a.weeks_completed);
}
