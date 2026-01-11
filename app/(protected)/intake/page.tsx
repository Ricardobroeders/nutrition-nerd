'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IntakeCalendar } from '@/components/intake-calendar';
import { getCurrentUser, getUserIntake, removeIntake } from '@/lib/supabase';
import { DailyIntakeSummary, UserIntake } from '@/types';
import { useRouter } from 'next/navigation';

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function IntakePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [intakeData, setIntakeData] = useState<UserIntake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);

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

  // Group intake by date
  const dailySummaries = useMemo<DailyIntakeSummary[]>(() => {
    const grouped = new Map<string, UserIntake[]>();

    intakeData.forEach((intake) => {
      const date = intake.intake_date;
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(intake);
    });

    const summaries: DailyIntakeSummary[] = [];
    grouped.forEach((items, date) => {
      summaries.push({
        date,
        items: items.map((i) => i.food_item!).filter(Boolean),
        unique_count: new Set(items.map((i) => i.food_item_id)).size,
      });
    });

    return summaries.sort((a, b) => b.date.localeCompare(a.date));
  }, [intakeData]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const monday = getMonday(new Date());
    const weekIntake = intakeData.filter((i) => {
      const intakeDate = new Date(i.intake_date);
      return intakeDate >= monday;
    });

    const uniqueIds = new Set(weekIntake.map((i) => i.food_item_id));
    const totalItems = weekIntake.length;

    return {
      unique: uniqueIds.size,
      total: totalItems,
    };
  }, [intakeData]);

  const handleRemoveItem = async (date: string, itemId: string) => {
    // Find the intake record to remove
    const intakeToRemove = intakeData.find(
      (intake) => intake.intake_date === date && intake.food_item_id === itemId
    );

    if (!intakeToRemove) return;

    const { error } = await removeIntake(intakeToRemove.id);

    if (error) {
      console.error('Error removing intake:', error);
      return;
    }

    // Update local state
    setIntakeData(
      intakeData.filter(
        (intake) => !(intake.intake_date === date && intake.food_item_id === itemId)
      )
    );
  };

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
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Mijn Intake 📊
        </h1>
        <p className="text-gray-600 mt-1">
          Bekijk je intake geschiedenis en statistieken
        </p>
      </div>

      {/* Weekly summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deze Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-700">
                {weeklyStats.unique}
              </span>
              <span className="text-sm text-gray-600">unieke items</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Totaal Deze Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-700">
                {weeklyStats.total}
              </span>
              <span className="text-sm text-gray-600">items</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekdoel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-700">
                {Math.min(100, Math.round((weeklyStats.unique / 25) * 100))}%
              </span>
              <span className="text-sm text-gray-600">van 25</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar view */}
      <Card>
        <CardHeader>
          <CardTitle>Dagelijkse Intake</CardTitle>
          <CardDescription>
            Klik op een dag om details te zien en items te verwijderen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IntakeCalendar
            dailySummaries={dailySummaries}
            onRemoveItem={handleRemoveItem}
          />
        </CardContent>
      </Card>
    </div>
  );
}
