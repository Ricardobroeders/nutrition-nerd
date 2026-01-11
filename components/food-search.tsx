'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus } from 'lucide-react';
import { FoodItem, FoodType } from '@/types';

interface FoodSearchProps {
  foodItems: FoodItem[];
  onAdd: (item: FoodItem) => void;
  addedItemIds?: string[];
  showFilters?: boolean;
}

export function FoodSearch({
  foodItems,
  onAdd,
  addedItemIds = [],
  showFilters = true,
}: FoodSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<FoodType | 'all'>('all');

  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesSearch = item.name_nl
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [foodItems, searchQuery, typeFilter]);

  const isAdded = (itemId: string) => addedItemIds.includes(itemId);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Zoek groente of fruit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter buttons */}
      {showFilters && (
        <div className="flex gap-2">
          <Button
            variant={typeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('all')}
            className={typeFilter === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
          >
            Alles
          </Button>
          <Button
            variant={typeFilter === 'fruit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('fruit')}
            className={typeFilter === 'fruit' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
          >
            🍎 Fruit
          </Button>
          <Button
            variant={typeFilter === 'vegetable' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('vegetable')}
            className={typeFilter === 'vegetable' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
          >
            🥦 Groente
          </Button>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={isAdded(item.id) ? 'border-emerald-500 bg-emerald-50' : ''}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name_nl}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.type === 'fruit' ? '🍎 Fruit' : '🥦 Groente'}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="icon"
                  onClick={() => onAdd(item)}
                  disabled={isAdded(item.id)}
                  className={
                    isAdded(item.id)
                      ? 'bg-emerald-600'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }
                >
                  {isAdded(item.id) ? '✓' : <Plus className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Geen resultaten gevonden</p>
          <p className="text-sm mt-1">Probeer een andere zoekopdracht</p>
        </div>
      )}
    </div>
  );
}
