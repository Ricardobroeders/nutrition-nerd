'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardTable } from '@/components/leaderboard-table';
import { generateMockLeaderboard } from '@/lib/mock-data';

export default function KlassementPage() {
  const [weeklyLeaderboard] = useState(generateMockLeaderboard('week'));
  const [alltimeLeaderboard] = useState(generateMockLeaderboard('alltime'));
  const [activeTab, setActiveTab] = useState('week');

  const currentUserWeekly = weeklyLeaderboard.find((e) => e.is_current_user);
  const currentUserAlltime = alltimeLeaderboard.find((e) => e.is_current_user);

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

      {/* Current user position */}
      <Card className="mb-6 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-lg">Jouw Positie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Deze Week</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-emerald-700">
                  #{currentUserWeekly?.rank || '-'}
                </span>
                <span className="text-2xl">
                  {currentUserWeekly && currentUserWeekly.rank <= 3 ? '🏅' : ''}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {currentUserWeekly?.unique_items_count || 0} unieke items
              </p>
            </div>
            <div className="text-center border-l border-emerald-200">
              <p className="text-sm text-gray-600 mb-1">Altijd</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-gray-700">
                  #{currentUserAlltime?.rank || '-'}
                </span>
                <span className="text-2xl">
                  {currentUserAlltime && currentUserAlltime.rank <= 3 ? '🏅' : ''}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {currentUserAlltime?.unique_items_count || 0} unieke items
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Ranglijst</CardTitle>
          <CardDescription>
            Top 20 gebruikers op basis van unieke items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="week">Deze Week</TabsTrigger>
              <TabsTrigger value="alltime">Altijd</TabsTrigger>
            </TabsList>

            <TabsContent value="week">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ℹ️ De wekelijkse ranglijst reset elke maandag om 00:00 uur
                </p>
              </div>
              <LeaderboardTable entries={weeklyLeaderboard} />
            </TabsContent>

            <TabsContent value="alltime">
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  ℹ️ De algemene ranglijst toont alle unieke items die ooit zijn gegeten
                </p>
              </div>
              <LeaderboardTable entries={alltimeLeaderboard} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Info section */}
      <Card className="mt-6">
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
                Haal 25+ unieke items per week om je streak te verhogen en een topositie te behouden.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
