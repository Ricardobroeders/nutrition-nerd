'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DailyIntakeSummary } from '@/types';

interface IntakeCalendarProps {
  dailySummaries: DailyIntakeSummary[];
  onRemoveItem?: (date: string, itemId: string) => void;
}

export function IntakeCalendar({ dailySummaries, onRemoveItem }: IntakeCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    dailySummaries.length > 0 ? dailySummaries[0].date : null
  );

  const selectedSummary = dailySummaries.find((s) => s.date === selectedDate);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Vandaag';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Gisteren';
    } else {
      return date.toLocaleDateString('nl-NL', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Date selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {dailySummaries.map((summary) => (
          <Button
            key={summary.date}
            variant={selectedDate === summary.date ? 'default' : 'outline'}
            onClick={() => setSelectedDate(summary.date)}
            className={`flex-shrink-0 ${
              selectedDate === summary.date
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : ''
            }`}
          >
            <div className="text-center">
              <div className="text-xs">{formatDate(summary.date)}</div>
              <div className="text-lg font-bold">{summary.unique_count}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Selected date details */}
      {selectedSummary ? (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {formatFullDate(selectedSummary.date)}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedSummary.unique_count} unieke items gegeten
              </p>
            </div>

            <div className="space-y-2">
              {selectedSummary.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {item.type === 'fruit' ? '🍎' : '🥦'}
                    </span>
                    <div>
                      <p className="font-medium">{item.name_nl}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  {onRemoveItem && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(selectedSummary.date, item.id)}
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {selectedSummary.items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Geen items gegeten op deze dag</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <p>Geen intake gegevens beschikbaar</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
