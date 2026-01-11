'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function KlassementPage() {
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

      <Card>
        <CardHeader>
          <CardTitle>Binnenkort Beschikbaar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-semibold mb-2">Leaderboard komt eraan!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Het klassement wordt binnenkort geactiveerd. Dan kun je zien hoe je het doet
              ten opzichte van andere gebruikers op basis van unieke items per week.
            </p>
          </div>
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
