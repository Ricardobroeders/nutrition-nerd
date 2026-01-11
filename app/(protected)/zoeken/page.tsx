'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FoodSearch } from '@/components/food-search';
import { getCurrentUser, getFoodItems, getUserIntake, addIntake } from '@/lib/supabase';
import { FoodItem, UserIntake } from '@/types';
import { useRouter } from 'next/navigation';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function ZoekenPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [intakeData, setIntakeData] = useState<UserIntake[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const today = formatDate(new Date());

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

  const todaysIntake = intakeData.filter((i) => i.intake_date === today);
  const todayItemIds = todaysIntake.map((i) => i.food_item_id);

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
      setIntakeData([...intakeData, newIntake]);
      setLastAddedItem(item.name_nl);
      setShowSuccess(true);

      // Hide success message after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000);
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
          Voedsel Zoeken 🔍
        </h1>
        <p className="text-gray-600 mt-1">
          Zoek en voeg groente of fruit toe aan je dagelijkse intake
        </p>
      </div>

      {/* Success notification */}
      {showSuccess && (
        <div className="mb-4 p-4 bg-emerald-100 border border-emerald-500 rounded-lg text-emerald-800">
          ✅ <strong>{lastAddedItem}</strong> toegevoegd aan vandaag!
        </div>
      )}

      {/* Today's count */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vandaag toegevoegd</p>
              <p className="text-3xl font-bold text-emerald-700">
                {todaysIntake.length}
              </p>
            </div>
            <div className="text-5xl">
              {todaysIntake.length === 0 ? '😴' : todaysIntake.length >= 5 ? '🎉' : '😊'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search section */}
      <Card>
        <CardHeader>
          <CardTitle>Alle groente en fruit</CardTitle>
          <CardDescription>
            Klik op het + icoon om een item toe te voegen aan vandaag
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
    </div>
  );
}
