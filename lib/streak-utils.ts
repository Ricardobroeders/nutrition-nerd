import { UserIntake, WeeklyStats } from '@/types';

/**
 * Get the Monday of the current week
 * If today is Monday, returns today. Otherwise returns the most recent Monday.
 */
export function getMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // If today is Monday (1), keep it (subtract 0 days)
  // If today is Sunday (0), go back 6 days to previous Monday
  // Otherwise, go back to the most recent Monday
  const daysToSubtract = day === 0 ? 6 : day - 1;

  d.setDate(d.getDate() - daysToSubtract);
  return d;
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get all Mondays between two dates
 */
export function getWeeksBetween(startDate: Date, endDate: Date): Date[] {
  const weeks: Date[] = [];
  let current = getMonday(startDate);
  const end = getMonday(endDate);

  while (current <= end) {
    weeks.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  return weeks;
}

/**
 * Calculate weekly stats from intake data
 */
export function calculateWeeklyStats(
  intake: UserIntake[],
  weekStartDate: Date
): { unique_items_count: number; week_start_date: string } {
  const weekStart = getMonday(weekStartDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const weekIntake = intake.filter((item) => {
    const intakeDate = new Date(item.intake_date);
    return intakeDate >= weekStart && intakeDate < weekEnd;
  });

  const uniqueItems = new Set(weekIntake.map((item) => item.food_item_id));

  return {
    unique_items_count: uniqueItems.size,
    week_start_date: formatDate(weekStart),
  };
}

/**
 * Calculate current streak based on weekly stats
 * Streak increments when user reaches 30+ unique items in a week
 * Streak resets to 0 if user fails to meet 30+ items in any week
 */
export function calculateStreak(weeklyStats: WeeklyStats[]): {
  current_streak: number;
  longest_streak: number;
} {
  if (weeklyStats.length === 0) {
    return { current_streak: 0, longest_streak: 0 };
  }

  // Sort by week_start_date descending (most recent first)
  const sortedStats = [...weeklyStats].sort(
    (a, b) => new Date(b.week_start_date).getTime() - new Date(a.week_start_date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (from most recent week backwards)
  for (const stat of sortedStats) {
    if (stat.unique_items_count >= 30) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  for (const stat of sortedStats.reverse()) {
    if (stat.unique_items_count >= 30) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { current_streak: currentStreak, longest_streak: longestStreak };
}

/**
 * Check if user is at risk of losing their streak
 * Returns true if current week has < 30 items and it's past Wednesday
 */
export function isStreakAtRisk(currentWeekUniqueCount: number): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // If it's past Wednesday (day 3) and still under 30, user is at risk
  const isPastWednesday = dayOfWeek >= 3;
  const isBelowGoal = currentWeekUniqueCount < 30;

  return isPastWednesday && isBelowGoal;
}

/**
 * Calculate weekly progress percentage
 */
export function getWeeklyProgress(uniqueCount: number, goal: number = 30): number {
  return Math.min(100, Math.round((uniqueCount / goal) * 100));
}

/**
 * Get week number of the year
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Format week range for display (e.g., "13 - 19 Jan")
 */
export function formatWeekRange(weekStartDate: string): string {
  const start = new Date(weekStartDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = start.toLocaleDateString('nl-NL', { month: 'short' });

  return `${startDay} - ${endDay} ${month}`;
}
