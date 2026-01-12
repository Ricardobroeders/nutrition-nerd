'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardTable, LeaderboardEntry } from '@/components/leaderboard-table';
import { getAllTimeLeaderboard, getWeeklyStreaksLeaderboard, getCurrentUser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function KlassementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyStreaksLeaderboard, setWeeklyStreaksLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function loadLeaderboards() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }

        setCurrentUserId(currentUser.id);

        // Load all-time leaderboard
        const allTimeData = await getAllTimeLeaderboard();
        const allTimeEntries: LeaderboardEntry[] = allTimeData.map(user => ({
          id: user.id,
          display_name: user.display_name,
          score: user.total_unique_items,
          is_current_user: user.id === currentUser.id,
        }));
        setAllTimeLeaderboard(allTimeEntries);

        // Load weekly streaks leaderboard
        const weeklyStreaksData = await getWeeklyStreaksLeaderboard();
        const weeklyStreaksEntries: LeaderboardEntry[] = weeklyStreaksData.map(user => ({
          id: user.id,
          display_name: user.display_name,
          score: user.weeks_completed,
          is_current_user: user.id === currentUser.id,
        }));
        setWeeklyStreaksLeaderboard(weeklyStreaksEntries);
      } catch (error) {
        console.error('Error loading leaderboards:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboards();
  }, [router]);

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
          Klassement 🏆
        </h1>
        <p className="text-gray-600 mt-1">
          Zie hoe je het doet ten opzichte van anderen
        </p>
      </div>

      {/* All-time leaderboard */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Totaal Unieke Items (All-Time)</CardTitle>
          <CardDescription>
            Het totaal aantal verschillende groenten en fruit die je ooit hebt gegeten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaderboardTable entries={allTimeLeaderboard} scoreLabel="totaal uniek" />
        </CardContent>
      </Card>

      {/* Weekly streaks leaderboard */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Wekelijkse Streaks</CardTitle>
          <CardDescription>
            Aantal keer dat het weekdoel van 30 unieke items behaald is
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaderboardTable entries={weeklyStreaksLeaderboard} scoreLabel="weken behaald" />
        </CardContent>
      </Card>

      {/* Info section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hoe werkt het klassement?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-3">
            <span className="text-xl">📊</span>
            <div>
              <p className="font-medium">Unieke Items Tellen</p>
              <p className="text-gray-600">
                Alleen unieke groente en fruit tellen mee. Dezelfde appel twee keer eten telt maar één keer.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🔄</span>
            <div>
              <p className="font-medium">Wekelijkse Reset</p>
              <p className="text-gray-600">
                De wekelijkse ranglijst begint elke maandag opnieuw. Perfect om elkaar uit te dagen!
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🏆</span>
            <div>
              <p className="font-medium">Streaks & Prestaties</p>
              <p className="text-gray-600">
                Haal 30+ unieke items per week om je streak te verhogen en een topositie te behouden.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
