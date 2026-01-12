import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal } from 'lucide-react';

export interface LeaderboardEntry {
  id: string;
  display_name: string;
  score: number;
  is_current_user?: boolean;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  scoreLabel: string;
}

export function LeaderboardTable({ entries, scoreLabel }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
    return <span className="text-sm text-gray-600">#{rank}</span>;
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
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <Card
          key={entry.id}
          className={entry.is_current_user ? 'border-emerald-500 bg-emerald-50' : ''}
        >
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              {/* Rank */}
              <div className="flex items-center justify-center w-10">
                {getRankIcon(index + 1)}
              </div>

              {/* Avatar */}
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-emerald-600 text-white font-semibold">
                  {getInitials(entry.display_name)}
                </AvatarFallback>
              </Avatar>

              {/* Name */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.display_name}</span>
                  {entry.is_current_user && (
                    <Badge variant="secondary" className="text-xs">
                      Jij
                    </Badge>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-700">
                  {entry.score}
                </div>
                <div className="text-xs text-gray-500">{scoreLabel}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {entries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nog geen ranglijst beschikbaar</p>
        </div>
      )}
    </div>
  );
}
