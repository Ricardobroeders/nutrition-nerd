'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StreakIndicator } from '@/components/streak-indicator';
import { FoodSearch } from '@/components/food-search';
import { mockCurrentUser, mockFoodItems, generateMockIntake, getMonday, formatDate } from '@/lib/mock-data';
import { FoodItem, UserIntake } from '@/types';

export default function DashboardPage() {
  const [intakeData, setIntakeData] = useState<UserIntake[]>(generateMockIntake());

  const today = formatDate(new Date());
  const monday = getMonday(new Date());
  const weekStart = formatDate(monday);

  // Calculate today's intake
  const todaysIntake = useMemo(() => {
    return intakeData.filter((i) => i.intake_date === today);
  }, [intakeData, today]);

  // Calculate this week's unique items
  const weeklyUniqueCount = useMemo(() => {
    const weekIntake = intakeData.filter((i) => {
      const intakeDate = new Date(i.intake_date);
      return intakeDate >= monday;
    });
    const uniqueIds = new Set(weekIntake.map((i) => i.food_item_id));
    return uniqueIds.size;
  }, [intakeData, monday]);

  const handleAddItem = (item: FoodItem) => {
    // Check if already added today
    const alreadyAdded = todaysIntake.some((i) => i.food_item_id === item.id);
    if (alreadyAdded) return;

    const newIntake: UserIntake = {
      id: `intake-${Date.now()}`,
      user_id: mockCurrentUser.id,
      food_item_id: item.id,
      intake_date: today,
      created_at: new Date().toISOString(),
      food_item: item,
    };

    setIntakeData([...intakeData, newIntake]);
  };

  const todayItemIds = todaysIntake.map((i) => i.food_item_id);
  const weeklyProgress = (weeklyUniqueCount / 25) * 100;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Welcome section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welkom terug, {mockCurrentUser.display_name}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Vandaag heb je {todaysIntake.length} items gegeten
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Streak indicator */}
        <div className="lg:col-span-2">
          <StreakIndicator
            currentStreak={mockCurrentUser.current_streak}
            longestStreak={mockCurrentUser.longest_streak}
            weeklyProgress={weeklyUniqueCount}
            weeklyGoal={25}
          />
        </div>

        {/* Weekly progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekdoel</CardTitle>
            <CardDescription>25 unieke items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Voortgang</span>
                <span className="font-semibold text-emerald-700">
                  {weeklyUniqueCount}/25
                </span>
              </div>
              <Progress value={weeklyProgress} className="h-3" />
              <p className="text-xs text-gray-500 text-center">
                {25 - weeklyUniqueCount > 0
                  ? `Nog ${25 - weeklyUniqueCount} items te gaan!`
                  : 'Doel behaald! 🎉'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's intake summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Vandaag gegeten</CardTitle>
          <CardDescription>
            {todaysIntake.length} items toegevoegd
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaysIntake.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {todaysIntake.map((intake) => (
                <div
                  key={intake.id}
                  className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {intake.food_item?.name_nl}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Nog niets gegeten vandaag. Voeg hieronder items toe!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick add section */}
      <Card>
        <CardHeader>
          <CardTitle>Voeg toe aan vandaag</CardTitle>
          <CardDescription>
            Zoek en voeg groente of fruit toe aan je dagelijkse intake
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FoodSearch
            foodItems={mockFoodItems}
            onAdd={handleAddItem}
            addedItemIds={todayItemIds}
          />
        </CardContent>
      </Card>
    </div>
  );
}
