import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StreakIndicatorProps {
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: number;
  weeklyGoal?: number;
}

export function StreakIndicator({
  currentStreak,
  longestStreak,
  weeklyProgress,
  weeklyGoal = 30,
}: StreakIndicatorProps) {
  const isAtRisk = weeklyProgress < weeklyGoal && currentStreak > 0;
  const hasReachedGoal = weeklyProgress >= weeklyGoal;

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Huidige streak</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold text-emerald-700">
                {currentStreak}
              </span>
              {currentStreak > 0 && <span className="text-2xl">🔥</span>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Langste streak</p>
            <div className="flex items-center gap-2 mt-1 justify-end">
              <span className="text-3xl font-bold text-gray-700">
                {longestStreak}
              </span>
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {hasReachedGoal && (
            <Badge className="w-full justify-center bg-emerald-600 hover:bg-emerald-700">
              🎉 Deze week doel behaald!
            </Badge>
          )}
          {isAtRisk && (
            <Badge variant="outline" className="w-full justify-center border-orange-500 text-orange-700">
              ⚠️ {weeklyGoal - weeklyProgress} items nodig voor streak
            </Badge>
          )}
          <div className="text-center text-sm text-gray-600 pt-2">
            Deze week: <strong>{weeklyProgress}/{weeklyGoal}</strong> unieke items
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
