import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal } from 'lucide-react';

export interface LeaderboardEntry {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  score: number;
  is_current_user?: boolean;
  subtitle?: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  scoreLabel: string;
}

export function LeaderboardTable({ entries, scoreLabel }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400 dark:text-gray-500" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
    return <span className="text-sm text-muted-foreground">#{rank}</span>;
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
          className={entry.is_current_user ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : ''}
        >
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              {/* Rank */}
              <div className="flex items-center justify-center w-10">
                {getRankIcon(index + 1)}
              </div>

              {/* Avatar */}
              <Avatar className="w-8 h-8">
                {entry.avatar_url && (
                  <AvatarImage src={entry.avatar_url} alt={entry.display_name} />
                )}
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
                {entry.subtitle && (
                  <p className="text-xs text-muted-foreground">{entry.subtitle}</p>
                )}
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {entry.score}
                </div>
                <div className="text-xs text-muted-foreground">{scoreLabel}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {entries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nog geen ranglijst beschikbaar</p>
        </div>
      )}
    </div>
  );
}
