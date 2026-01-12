'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StreakIndicator } from '@/components/streak-indicator';
import { getCurrentUser, getUserProfile, getUserIntake } from '@/lib/supabase';
import { UserIntake } from '@/types';
import { useRouter } from 'next/navigation';

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  // Reset time to start of day to avoid comparison issues
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [intakeData, setIntakeData] = useState<UserIntake[]>([]);
  const [loading, setLoading] = useState(true);

  const today = formatDate(new Date());
  const monday = getMonday(new Date());
  const weekStart = formatDate(monday);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);

        const profile = await getUserProfile(currentUser.id);
        setUserProfile(profile);

        const intake = await getUserIntake(currentUser.id);
        setIntakeData(intake as UserIntake[]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  // Calculate today's intake
  const todaysIntake = useMemo(() => {
    return intakeData.filter((i) => i.intake_date === today);
  }, [intakeData, today]);

  // Calculate this week's unique items
  const weeklyUniqueCount = useMemo(() => {
    // Calculate end of week (next Monday)
    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    const weekEnd = formatDate(nextMonday);

    const weekIntake = intakeData.filter((i) => {
      return i.intake_date >= weekStart && i.intake_date < weekEnd;
    });
    const uniqueIds = new Set(weekIntake.map((i) => i.food_item_id));
    return uniqueIds.size;
  }, [intakeData, weekStart, monday]);
  const weeklyProgress = (weeklyUniqueCount / 30) * 100;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="text-center py-12">
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Welcome section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welkom terug, {userProfile?.display_name || user?.email}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Vandaag heb je {todaysIntake.length} items gegeten
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Streak indicator */}
        <div className="lg:col-span-2">
          <StreakIndicator
            currentStreak={userProfile?.current_streak || 0}
            longestStreak={userProfile?.longest_streak || 0}
            weeklyProgress={weeklyUniqueCount}
            weeklyGoal={30}
          />
        </div>

        {/* Weekly progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekdoel</CardTitle>
            <CardDescription>30 unieke items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Voortgang</span>
                <span className="font-semibold text-emerald-700">
                  {weeklyUniqueCount}/30
                </span>
              </div>
              <Progress value={weeklyProgress} className="h-3" />
              <p className="text-xs text-gray-500 text-center">
                {30 - weeklyUniqueCount > 0
                  ? `Nog ${30 - weeklyUniqueCount} items te gaan!`
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

    </div>
  );
}
