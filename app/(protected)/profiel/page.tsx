'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Pencil, Check, X, Sun, Moon, Monitor } from 'lucide-react';
import { getCurrentUser, getUserProfile, getUserIntake, signOut, updateUserDisplayName } from '@/lib/supabase';
import { useTheme } from '@/components/theme-provider';

export default function ProfielPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [intakeData, setIntakeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [savingName, setSavingName] = useState(false);

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
        setIntakeData(intake);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

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
      (i) => i.food_item?.type === 'groente'
    ).length;

    return {
      totalUnique: allUniqueItems.size,
      weekUnique: weekUniqueItems.size,
      totalIntake: intakeData.length,
      fruitCount,
      vegetableCount,
    };
  }, [intakeData]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const handleEditName = () => {
    setNewDisplayName(userProfile?.display_name || '');
    setIsEditingName(true);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setNewDisplayName('');
  };

  const handleSaveName = async () => {
    if (!user || !newDisplayName.trim()) return;

    setSavingName(true);
    const { data, error } = await updateUserDisplayName(user.id, newDisplayName.trim());

    if (error) {
      console.error('Error updating display name:', error);
    } else if (data) {
      setUserProfile(data);
      setIsEditingName(false);
    }
    setSavingName(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Profiel 👤
        </h1>
        <p className="text-muted-foreground mt-1">Beheer je account en bekijk je statistieken</p>
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
                {getInitials(userProfile?.display_name || user?.email || 'NN')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Weergavenaam
                </label>
                {isEditingName ? (
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder="Voer je naam in"
                      className="max-w-xs"
                      disabled={savingName}
                    />
                    <Button
                      size="icon"
                      variant="default"
                      onClick={handleSaveName}
                      disabled={savingName || !newDisplayName.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={savingName}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">
                      {userProfile?.display_name || 'Nutrition Nerd User'}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleEditName}
                      className="h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="mb-2">
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="text-foreground">{userProfile?.email || user?.email}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Lid sinds</label>
                <p className="text-foreground">
                  {new Date(userProfile?.created_at || Date.now()).toLocaleDateString('nl-NL', {
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
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                  {userProfile?.current_streak || 0}
                </span>
                <span className="text-3xl">🔥</span>
              </div>
              <p className="text-sm text-muted-foreground">Huidige Streak</p>
              <Badge className="mt-2 bg-emerald-600">
                {(userProfile?.current_streak || 0) > 0 ? 'Actief' : 'Start vandaag!'}
              </Badge>
            </div>

            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-4xl font-bold text-yellow-700 dark:text-yellow-400">
                  {userProfile?.longest_streak || 0}
                </span>
                <span className="text-3xl">🏆</span>
              </div>
              <p className="text-sm text-muted-foreground">Langste Streak</p>
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
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{stats.totalUnique}</p>
              <p className="text-xs text-muted-foreground">Unieke Items Totaal</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stats.weekUnique}</p>
              <p className="text-xs text-muted-foreground">Deze Week Uniek</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{stats.totalIntake}</p>
              <p className="text-xs text-muted-foreground">Totaal Gegeten</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">
                {Math.round((stats.fruitCount / stats.totalIntake) * 100) || 0}%
              </p>
              <p className="text-xs text-muted-foreground">Fruit vs Groente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Weergave</CardTitle>
          <CardDescription>Kies je voorkeursthema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                theme === 'light'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-emerald-600' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                Light
              </span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                theme === 'dark'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-emerald-600' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                Dark
              </span>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                theme === 'system'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <Monitor className={`w-6 h-6 ${theme === 'system' ? 'text-emerald-600' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${theme === 'system' ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                Systeem
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-400">Account Acties</CardTitle>
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
