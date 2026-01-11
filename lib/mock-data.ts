import { FoodItem, User, UserIntake, LeaderboardEntry } from '@/types';

// Mock food items - 50+ Dutch fruits and vegetables
export const mockFoodItems: FoodItem[] = [
  // Fruits
  { id: '1', name_nl: 'Appel', type: 'fruit', category: 'Kernfruit', created_at: '2024-01-01' },
  { id: '2', name_nl: 'Peer', type: 'fruit', category: 'Kernfruit', created_at: '2024-01-01' },
  { id: '3', name_nl: 'Banaan', type: 'fruit', category: 'Tropisch', created_at: '2024-01-01' },
  { id: '4', name_nl: 'Sinaasappel', type: 'fruit', category: 'Citrus', created_at: '2024-01-01' },
  { id: '5', name_nl: 'Mandarijn', type: 'fruit', category: 'Citrus', created_at: '2024-01-01' },
  { id: '6', name_nl: 'Citroen', type: 'fruit', category: 'Citrus', created_at: '2024-01-01' },
  { id: '7', name_nl: 'Limoen', type: 'fruit', category: 'Citrus', created_at: '2024-01-01' },
  { id: '8', name_nl: 'Aardbei', type: 'fruit', category: 'Bessen', created_at: '2024-01-01' },
  { id: '9', name_nl: 'Framboos', type: 'fruit', category: 'Bessen', created_at: '2024-01-01' },
  { id: '10', name_nl: 'Blauwe bes', type: 'fruit', category: 'Bessen', created_at: '2024-01-01' },
  { id: '11', name_nl: 'Braam', type: 'fruit', category: 'Bessen', created_at: '2024-01-01' },
  { id: '12', name_nl: 'Druiven', type: 'fruit', category: 'Bessen', created_at: '2024-01-01' },
  { id: '13', name_nl: 'Kiwi', type: 'fruit', category: 'Tropisch', created_at: '2024-01-01' },
  { id: '14', name_nl: 'Mango', type: 'fruit', category: 'Tropisch', created_at: '2024-01-01' },
  { id: '15', name_nl: 'Ananas', type: 'fruit', category: 'Tropisch', created_at: '2024-01-01' },
  { id: '16', name_nl: 'Watermeloen', type: 'fruit', category: 'Meloen', created_at: '2024-01-01' },
  { id: '17', name_nl: 'Meloen', type: 'fruit', category: 'Meloen', created_at: '2024-01-01' },
  { id: '18', name_nl: 'Perzik', type: 'fruit', category: 'Steenfruit', created_at: '2024-01-01' },
  { id: '19', name_nl: 'Nectarine', type: 'fruit', category: 'Steenfruit', created_at: '2024-01-01' },
  { id: '20', name_nl: 'Abrikoos', type: 'fruit', category: 'Steenfruit', created_at: '2024-01-01' },
  { id: '21', name_nl: 'Pruim', type: 'fruit', category: 'Steenfruit', created_at: '2024-01-01' },
  { id: '22', name_nl: 'Kers', type: 'fruit', category: 'Steenfruit', created_at: '2024-01-01' },
  { id: '23', name_nl: 'Papaja', type: 'fruit', category: 'Tropisch', created_at: '2024-01-01' },
  { id: '24', name_nl: 'Granaatappel', type: 'fruit', category: 'Exotisch', created_at: '2024-01-01' },
  { id: '25', name_nl: 'Vijg', type: 'fruit', category: 'Exotisch', created_at: '2024-01-01' },
  { id: '26', name_nl: 'Dadel', type: 'fruit', category: 'Exotisch', created_at: '2024-01-01' },
  { id: '27', name_nl: 'Passievrucht', type: 'fruit', category: 'Tropisch', created_at: '2024-01-01' },
  { id: '28', name_nl: 'Lychee', type: 'fruit', category: 'Tropisch', created_at: '2024-01-01' },

  // Vegetables
  { id: '29', name_nl: 'Tomaat', type: 'groente', category: 'Vruchtgroente', created_at: '2024-01-01' },
  { id: '30', name_nl: 'Komkommer', type: 'groente', category: 'Vruchtgroente', created_at: '2024-01-01' },
  { id: '31', name_nl: 'Paprika', type: 'groente', category: 'Vruchtgroente', created_at: '2024-01-01' },
  { id: '32', name_nl: 'Aubergine', type: 'groente', category: 'Vruchtgroente', created_at: '2024-01-01' },
  { id: '33', name_nl: 'Courgette', type: 'groente', category: 'Vruchtgroente', created_at: '2024-01-01' },
  { id: '34', name_nl: 'Wortel', type: 'groente', category: 'Wortelgroente', created_at: '2024-01-01' },
  { id: '35', name_nl: 'Ui', type: 'groente', category: 'Bolgewas', created_at: '2024-01-01' },
  { id: '36', name_nl: 'Knoflook', type: 'groente', category: 'Bolgewas', created_at: '2024-01-01' },
  { id: '37', name_nl: 'Prei', type: 'groente', category: 'Bolgewas', created_at: '2024-01-01' },
  { id: '38', name_nl: 'Broccoli', type: 'groente', category: 'Koolsoort', created_at: '2024-01-01' },
  { id: '39', name_nl: 'Bloemkool', type: 'groente', category: 'Koolsoort', created_at: '2024-01-01' },
  { id: '40', name_nl: 'Boerenkool', type: 'groente', category: 'Koolsoort', created_at: '2024-01-01' },
  { id: '41', name_nl: 'Spruitjes', type: 'groente', category: 'Koolsoort', created_at: '2024-01-01' },
  { id: '42', name_nl: 'Rode kool', type: 'groente', category: 'Koolsoort', created_at: '2024-01-01' },
  { id: '43', name_nl: 'Witte kool', type: 'groente', category: 'Koolsoort', created_at: '2024-01-01' },
  { id: '44', name_nl: 'Spinazie', type: 'groente', category: 'Bladgroente', created_at: '2024-01-01' },
  { id: '45', name_nl: 'Sla', type: 'groente', category: 'Bladgroente', created_at: '2024-01-01' },
  { id: '46', name_nl: 'Rucola', type: 'groente', category: 'Bladgroente', created_at: '2024-01-01' },
  { id: '47', name_nl: 'Andijvie', type: 'groente', category: 'Bladgroente', created_at: '2024-01-01' },
  { id: '48', name_nl: 'Postelein', type: 'groente', category: 'Bladgroente', created_at: '2024-01-01' },
  { id: '49', name_nl: 'Champignon', type: 'groente', category: 'Paddenstoel', created_at: '2024-01-01' },
  { id: '50', name_nl: 'Aardappel', type: 'groente', category: 'Knolgewas', created_at: '2024-01-01' },
  { id: '51', name_nl: 'Zoete aardappel', type: 'groente', category: 'Knolgewas', created_at: '2024-01-01' },
  { id: '52', name_nl: 'Radijs', type: 'groente', category: 'Wortelgroente', created_at: '2024-01-01' },
  { id: '53', name_nl: 'Biet', type: 'groente', category: 'Wortelgroente', created_at: '2024-01-01' },
  { id: '54', name_nl: 'Selderij', type: 'groente', category: 'Stengel', created_at: '2024-01-01' },
  { id: '55', name_nl: 'Venkel', type: 'groente', category: 'Stengel', created_at: '2024-01-01' },
  { id: '56', name_nl: 'Asperge', type: 'groente', category: 'Stengel', created_at: '2024-01-01' },
  { id: '57', name_nl: 'Paksoi', type: 'groente', category: 'Bladgroente', created_at: '2024-01-01' },
  { id: '58', name_nl: 'Chinese kool', type: 'groente', category: 'Koolsoort', created_at: '2024-01-01' },
  { id: '59', name_nl: 'Snijbonen', type: 'groente', category: 'Peulvrucht', created_at: '2024-01-01' },
  { id: '60', name_nl: 'Erwten', type: 'groente', category: 'Peulvrucht', created_at: '2024-01-01' },
  { id: '61', name_nl: 'Mais', type: 'groente', category: 'Vruchtgroente', created_at: '2024-01-01' },
  { id: '62', name_nl: 'Pompoen', type: 'groente', category: 'Vruchtgroente', created_at: '2024-01-01' },
];

// Mock current user
export const mockCurrentUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  display_name: 'Jan de Tester',
  created_at: '2024-01-01',
  current_streak: 3,
  longest_streak: 5,
};

// Mock users for leaderboard
export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user-2',
    email: 'anna@example.com',
    display_name: 'Anna Vermeer',
    created_at: '2024-01-01',
    current_streak: 5,
    longest_streak: 8,
  },
  {
    id: 'user-3',
    email: 'peter@example.com',
    display_name: 'Peter Jansen',
    created_at: '2024-01-01',
    current_streak: 2,
    longest_streak: 4,
  },
  {
    id: 'user-4',
    email: 'lisa@example.com',
    display_name: 'Lisa de Vries',
    created_at: '2024-01-01',
    current_streak: 4,
    longest_streak: 6,
  },
  {
    id: 'user-5',
    email: 'mark@example.com',
    display_name: 'Mark Bakker',
    created_at: '2024-01-01',
    current_streak: 1,
    longest_streak: 3,
  },
];

// Helper function to get Monday of current week
export function getMonday(d: Date): Date {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Helper function to format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Generate mock intake for current user
export function generateMockIntake(): UserIntake[] {
  const today = new Date();
  const intake: UserIntake[] = [];

  // Add some items for today
  const todayItems = [1, 2, 29, 30, 34, 38, 44];
  todayItems.forEach((itemId, index) => {
    intake.push({
      id: `intake-today-${index}`,
      user_id: mockCurrentUser.id,
      food_item_id: itemId.toString(),
      intake_date: formatDate(today),
      created_at: new Date().toISOString(),
      food_item: mockFoodItems.find(f => f.id === itemId.toString()),
    });
  });

  // Add items for yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayItems = [3, 4, 31, 32, 35, 39, 45];
  yesterdayItems.forEach((itemId, index) => {
    intake.push({
      id: `intake-yesterday-${index}`,
      user_id: mockCurrentUser.id,
      food_item_id: itemId.toString(),
      intake_date: formatDate(yesterday),
      created_at: new Date().toISOString(),
      food_item: mockFoodItems.find(f => f.id === itemId.toString()),
    });
  });

  // Add items for this week
  const monday = getMonday(today);
  for (let i = 0; i < 5; i++) {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);

    const dayItems = mockFoodItems.slice(i * 5, i * 5 + 5);
    dayItems.forEach((item, index) => {
      intake.push({
        id: `intake-week-${i}-${index}`,
        user_id: mockCurrentUser.id,
        food_item_id: item.id,
        intake_date: formatDate(date),
        created_at: new Date().toISOString(),
        food_item: item,
      });
    });
  }

  return intake;
}

// Generate mock leaderboard
export function generateMockLeaderboard(type: 'week' | 'alltime'): LeaderboardEntry[] {
  const baseScores = type === 'week'
    ? [28, 27, 25, 24, 22, 21, 20, 18, 17, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5]
    : [156, 145, 132, 128, 115, 108, 95, 87, 76, 65, 58, 52, 47, 42, 38, 35, 30, 27, 24, 20];

  return mockUsers.map((user, index) => ({
    rank: index + 1,
    user_id: user.id,
    display_name: user.display_name,
    unique_items_count: baseScores[index] || Math.floor(Math.random() * 10) + 5,
    is_current_user: user.id === mockCurrentUser.id,
  }));
}
