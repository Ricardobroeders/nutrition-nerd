'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FoodSearch } from '@/components/food-search';
import { getCurrentUser, getFoodItems, getUserIntake, addIntake, removeIntake, updateWeeklyStats } from '@/lib/supabase';
import { FoodItem, UserIntake } from '@/types';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

function getMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  console.log('getMonday() called - NEW VERSION');
  console.log('Day of week:', day);

  // If today is Monday (1), keep it
  // If today is Sunday (0), go back 6 days to previous Monday
  // Otherwise, go back to the most recent Monday
  const daysToSubtract = day === 0 ? 6 : day - 1;

  console.log('Days to subtract:', daysToSubtract);

  d.setDate(d.getDate() - daysToSubtract);

  console.log('Calculated Monday:', d.toISOString().split('T')[0]);

  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function IntakePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [intakeData, setIntakeData] = useState<UserIntake[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string>('');
  const [activeTab, setActiveTab] = useState('daily');

  const today = formatDate(new Date());
  const monday = getMonday(new Date());

  console.log('=== INTAKE PAGE DEBUG ===');
  console.log('Today is:', today, 'Day of week:', new Date().getDay());
  console.log('Monday calculated as:', formatDate(monday));

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);

        const items = await getFoodItems();
        setFoodItems(items);

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

  // Calculate this week's intake
  const weeklyIntake = useMemo(() => {
    const weekStartStr = formatDate(monday);
    // Calculate end of week (next Monday)
    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    const weekEndStr = formatDate(nextMonday);

    console.log('Week filter:', { weekStartStr, weekEndStr });
    console.log('Total intake records:', intakeData.length);

    const filtered = intakeData.filter((i) => {
      return i.intake_date >= weekStartStr && i.intake_date < weekEndStr;
    });

    console.log('Filtered to', filtered.length, 'records for this week');
    console.log('Unique items:', new Set(filtered.map(i => i.food_item_id)).size);

    return filtered;
  }, [intakeData, monday]);

  const todayItemIds = todaysIntake.map((i) => i.food_item_id);
  const weeklyUniqueCount = new Set(weeklyIntake.map((i) => i.food_item_id)).size;

  const handleAddItem = async (item: FoodItem) => {
    if (!user) return;

    // Check if already added today
    const alreadyAdded = todaysIntake.some((i) => i.food_item_id === item.id);
    if (alreadyAdded) return;

    const { data, error } = await addIntake(user.id, item.id, today);

    if (error) {
      console.error('Error adding intake:', error);
      return;
    }

    if (data) {
      const newIntake: UserIntake = {
        ...data,
        food_item: item,
      };
      const updatedIntakeData = [...intakeData, newIntake];
      setIntakeData(updatedIntakeData);
      setLastAddedItem(item.name_nl);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Update weekly stats after adding item
      const weekStart = formatDate(monday);
      const nextMonday = new Date(monday);
      nextMonday.setDate(nextMonday.getDate() + 7);
      const weekEnd = formatDate(nextMonday);

      const weekIntake = updatedIntakeData.filter((i) => {
        return i.intake_date >= weekStart && i.intake_date < weekEnd;
      });
      const uniqueItemsThisWeek = new Set(weekIntake.map((i) => i.food_item_id)).size;

      await updateWeeklyStats(user.id, weekStart, uniqueItemsThisWeek);
    }
  };

  const handleRemoveItem = async (intakeId: string) => {
    const { error } = await removeIntake(intakeId);

    if (error) {
      console.error('Error removing intake:', error);
      return;
    }

    const updatedIntakeData = intakeData.filter((intake) => intake.id !== intakeId);
    setIntakeData(updatedIntakeData);

    // Update weekly stats after removing item
    if (user) {
      const weekStart = formatDate(monday);
      const nextMonday = new Date(monday);
      nextMonday.setDate(nextMonday.getDate() + 7);
      const weekEnd = formatDate(nextMonday);

      const weekIntake = updatedIntakeData.filter((i) => {
        return i.intake_date >= weekStart && i.intake_date < weekEnd;
      });
      const uniqueItemsThisWeek = new Set(weekIntake.map((i) => i.food_item_id)).size;

      await updateWeeklyStats(user.id, weekStart, uniqueItemsThisWeek);
    }
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
          Zoek en beheer je dagelijkse groente en fruit intake
        </p>
      </div>

      {/* Success notification */}
      {showSuccess && (
        <div className="mb-4 p-4 bg-emerald-100 border border-emerald-500 rounded-lg text-emerald-800">
          ✅ <strong>{lastAddedItem}</strong> toegevoegd aan vandaag!
        </div>
      )}

      {/* Search section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Voeg toe aan vandaag</CardTitle>
          <CardDescription>
            Zoek groente of fruit en voeg toe aan je intake
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FoodSearch
            foodItems={foodItems}
            onAdd={handleAddItem}
            addedItemIds={todayItemIds}
          />
        </CardContent>
      </Card>

      {/* Daily and Weekly tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="daily">Vandaag</TabsTrigger>
          <TabsTrigger value="weekly">Deze Week</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Vandaag Gegeten</CardTitle>
              <CardDescription>
                {formatDisplayDate(today)} • {todaysIntake.length} items
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todaysIntake.length > 0 ? (
                <div className="space-y-2">
                  {todaysIntake.map((intake) => (
                    <div
                      key={intake.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {intake.food_item?.type === 'fruit' ? '🍎' : '🥦'}
                        </span>
                        <div>
                          <p className="font-medium">{intake.food_item?.name_nl}</p>
                          <p className="text-sm text-gray-600">
                            {intake.food_item?.category || 'Geen categorie'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(intake.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nog niets gegeten vandaag</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Gebruik de zoekbalk hierboven om items toe te voegen
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Deze Week</CardTitle>
              <CardDescription>
                Vanaf {formatDisplayDate(formatDate(monday))} • {weeklyUniqueCount} unieke items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-900">Weekdoel: 30 unieke items</p>
                    <p className="text-sm text-blue-700 mt-1">
                      {weeklyUniqueCount >= 30
                        ? '🎉 Doel behaald!'
                        : `Nog ${30 - weeklyUniqueCount} items te gaan`}
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">
                    {weeklyUniqueCount}/30
                  </div>
                </div>
              </div>

              {weeklyIntake.length > 0 ? (
                <div className="space-y-2">
                  {weeklyIntake.map((intake) => (
                    <div
                      key={intake.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {intake.food_item?.type === 'fruit' ? '🍎' : '🥦'}
                        </span>
                        <div>
                          <p className="font-medium">{intake.food_item?.name_nl}</p>
                          <p className="text-sm text-gray-600">
                            {formatDisplayDate(intake.intake_date)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(intake.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nog geen intake deze week</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Begin vandaag met het toevoegen van items
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
