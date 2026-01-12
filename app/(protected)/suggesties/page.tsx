'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFoodItems } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase';

export default function SuggestiesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Form state
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState<'fruit' | 'groente'>('groente');
  const [productCategory, setProductCategory] = useState('none');

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);

        // Fetch all food items to extract unique categories
        const items = await getFoodItems();
        const uniqueCategories = Array.from(
          new Set(
            items
              .map((item) => item.category)
              .filter((cat): cat is string => cat !== null && cat !== undefined && cat !== '')
          )
        ).sort();

        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) {
      return;
    }

    setSubmitting(true);
    setShowError(false);

    try {
      const response = await fetch('/api/suggest-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: productName.trim(),
          productType,
          productCategory: productCategory && productCategory !== 'none' ? productCategory : null,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit suggestion');
      }

      // Reset form
      setProductName('');
      setProductType('groente');
      setProductCategory('none');

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setSubmitting(false);
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
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Product Suggesties 💡
        </h1>
        <p className="text-gray-600 mt-1">
          Mis je een product in de lijst? Stuur een suggestie!
        </p>
      </div>

      {/* Success message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-emerald-100 border border-emerald-500 rounded-lg text-emerald-800">
          ✅ Je suggestie is verstuurd! We bekijken het zo snel mogelijk.
        </div>
      )}

      {/* Error message */}
      {showError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-500 rounded-lg text-red-800">
          ❌ Er ging iets mis. Probeer het later opnieuw.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Stel een nieuw product voor</CardTitle>
          <CardDescription>
            Vul de onderstaande velden in om een product voor te stellen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product naam */}
            <div className="space-y-2">
              <Label htmlFor="productName">
                Product naam <span className="text-red-500">*</span>
              </Label>
              <Input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Bijv. Broccoli, Mango, etc."
                required
                disabled={submitting}
              />
            </div>

            {/* Product type */}
            <div className="space-y-2">
              <Label>
                Product type <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={productType}
                onValueChange={(value) => setProductType(value as 'fruit' | 'groente')}
                disabled={submitting}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="groente" id="groente" />
                  <Label htmlFor="groente" className="font-normal cursor-pointer">
                    🥦 Groente
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fruit" id="fruit" />
                  <Label htmlFor="fruit" className="font-normal cursor-pointer">
                    🍎 Fruit
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Product categorie */}
            <div className="space-y-2">
              <Label htmlFor="productCategory">Product categorie (optioneel)</Label>
              <Select
                value={productCategory}
                onValueChange={setProductCategory}
                disabled={submitting}
              >
                <SelectTrigger id="productCategory">
                  <SelectValue placeholder="Selecteer een categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Geen categorie</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Bijvoorbeeld: Kruiden, Specerijen, Knolgewassen, etc.
              </p>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={submitting || !productName.trim()}
            >
              {submitting ? 'Versturen...' : 'Verstuur Suggestie'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info section */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="font-medium text-blue-900">Over product suggesties</p>
              <p className="text-sm text-blue-800 mt-1">
                Je suggestie wordt naar ons team gestuurd. We beoordelen elke suggestie en voegen
                geschikte producten toe aan de lijst. Dit kan enkele dagen duren.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
