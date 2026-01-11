'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Edit2, Check, X } from 'lucide-react';
import { mockCurrentUser, generateMockIntake } from '@/lib/mock-data';

export default function ProfielPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(mockCurrentUser.display_name);
  const [tempDisplayName, setTempDisplayName] = useState(mockCurrentUser.display_name);
  const [intakeData] = useState(generateMockIntake());

  const stats = useMemo(() => {
    const allUniqueItems = new Set(intakeData.map((i) => i.food_item_id));

    const monday = new Date();
    monday.setDate(monday.getDate() - monday.getDay() + 1);

    const weekIntake = intakeData.filter((i) => {
      const intakeDate = new Date(i.intake_date);
      return intakeDate >= monday;
    });
    const weekUniqueItems = new Set(weekIntake.map((i) => i.food_item_id));

    const fruitCount = intakeData.filter(
      (i) => i.food_item?.type === 'fruit'
    ).length;
    const vegetableCount = intakeData.filter(
      (i) => i.food_item?.type === 'vegetable'
    ).length;

    return {
      totalUnique: allUniqueItems.size,
      weekUnique: weekUniqueItems.size,
      totalIntake: intakeData.length,
      fruitCount,
      vegetableCount,
    };
  }, [intakeData]);

  const handleSave = () => {
    setDisplayName(tempDisplayName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempDisplayName(displayName);
    setIsEditing(false);
  };

  const handleLogout = () => {
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Profiel 👤
        </h1>
        <p className="text-gray-600 mt-1">Beheer je account en bekijk je statistieken</p>
      </div>

      {/* Profile card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Persoonlijke Gegevens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-emerald-600 text-white text-2xl font-bold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-1 block">
                  Weergavenaam
                </label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      value={tempDisplayName}
                      onChange={(e) => setTempDisplayName(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button
                      size="icon"
                      onClick={handleSave}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">{displayName}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="mb-2">
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-gray-900">{mockCurrentUser.email}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Lid sinds</label>
                <p className="text-gray-900">
                  {new Date(mockCurrentUser.created_at).toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Streak Statistieken</CardTitle>
          <CardDescription>Je voortgang en prestaties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-4xl font-bold text-emerald-700">
                  {mockCurrentUser.current_streak}
                </span>
                <span className="text-3xl">🔥</span>
              </div>
              <p className="text-sm text-gray-600">Huidige Streak</p>
              <Badge className="mt-2 bg-emerald-600">
                {mockCurrentUser.current_streak > 0 ? 'Actief' : 'Start vandaag!'}
              </Badge>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-4xl font-bold text-yellow-700">
                  {mockCurrentUser.longest_streak}
                </span>
                <span className="text-3xl">🏆</span>
              </div>
              <p className="text-sm text-gray-600">Langste Streak</p>
              <Badge variant="secondary" className="mt-2">
                Persoonlijk Record
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Algemene Statistieken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.totalUnique}</p>
              <p className="text-xs text-gray-600">Unieke Items Totaal</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-700">{stats.weekUnique}</p>
              <p className="text-xs text-gray-600">Deze Week Uniek</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.totalIntake}</p>
              <p className="text-xs text-gray-600">Totaal Gegeten</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((stats.fruitCount / stats.totalIntake) * 100) || 0}%
              </p>
              <p className="text-xs text-gray-600">Fruit vs Groente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Account Acties</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full md:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Uitloggen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
