export type FoodType = 'fruit' | 'groente';

export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  current_streak: number;
  longest_streak: number;
}

export interface FoodItem {
  id: string;
  name_nl: string;
  type: FoodType;
  category: string | null;
  nutrient?: string | null;
  created_at: string;
}

export interface UserIntake {
  id: string;
  user_id: string;
  food_item_id: string;
  intake_date: string;
  created_at: string;
  food_item?: FoodItem;
}

export interface WeeklyStats {
  id: string;
  user_id: string;
  week_start_date: string;
  unique_items_count: number;
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  unique_items_count: number;
  is_current_user?: boolean;
}

export interface DailyIntakeSummary {
  date: string;
  items: FoodItem[];
  unique_count: number;
}

export interface WeeklyProgress {
  week_start_date: string;
  unique_items_count: number;
  goal: number;
  percentage: number;
  days: {
    date: string;
    has_intake: boolean;
    unique_count: number;
  }[];
}
