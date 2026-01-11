# Quick Start Guide

## Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

### 4. Login
Click "Inloggen met Google" - this will log you in as a mock user (no actual Google auth needed yet).

### 5. Explore the App

#### Dashboard
- See your current streak (🔥)
- Track weekly progress (goal: 25 unique items)
- Quick add fruits & vegetables

#### Voedsel Zoeken
- Search through 62 Dutch fruits & vegetables
- Filter by type (fruit/vegetable)
- Add items with the + button

#### Mijn Intake
- View daily intake calendar
- See what you ate each day
- Remove items if needed

#### Klassement
- Weekly leaderboard (resets Monday)
- All-time rankings
- Your current position

#### Profiel
- View your stats
- Edit display name
- Track your streaks

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (hot reload)

# Production
npm run build        # Build for production
npm start           # Run production server

# Code Quality
npm run lint        # Run ESLint
```

## Key Features to Test

### Streak System
1. Add 25+ different items this week to increase your streak
2. Streak is shown with 🔥 emoji
3. Warning ⚠️ appears if you're below 25 and week is ending

### Search & Filter
1. Use search bar to find specific items
2. Click filter buttons (Alles, Fruit, Groente)
3. Items turn green after adding

### Leaderboard
1. Switch between "Deze Week" and "Altijd" tabs
2. Your position is highlighted in green
3. Top 3 get special medal icons

### Profile Stats
- Total unique items ever
- This week's unique count
- Fruit vs vegetable ratio
- Current & longest streak

## Mock Data

The app currently uses mock data that includes:

- **62 Food Items**: Mix of Dutch fruits & vegetables
- **5 Mock Users**: For leaderboard testing
- **Current User**: "Jan de Tester"
- **Sample Intake**: Pre-populated with this week's data

**Note**: All data resets on page refresh (no persistence yet).

## File Structure Overview

```
nutrition-nerd/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Public routes (login)
│   ├── (protected)/       # Protected routes (dashboard, etc.)
│   └── globals.css        # Global styles & theme
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Custom components
├── lib/                  # Utilities & data
│   ├── mock-data.ts      # 62 food items + mock users
│   ├── streak-utils.ts   # Streak calculation logic
│   └── supabase.ts       # Supabase placeholder
└── types/                # TypeScript definitions
```

## Common Tasks

### Add More Food Items
Edit [lib/mock-data.ts](lib/mock-data.ts) and add to `mockFoodItems` array:

```typescript
{
  id: '63',
  name_nl: 'Nieuwe Vrucht',
  type: 'fruit',
  category: 'Categorie',
  created_at: '2024-01-01'
}
```

### Change Theme Colors
Edit [app/globals.css](app/globals.css) CSS variables:

```css
:root {
  --primary: 160 84% 39%;  /* Emerald green */
}
```

### Modify Streak Goal
Default is 25 items/week. Change in components:

```typescript
const WEEKLY_GOAL = 30; // Change to your desired goal
```

## Next Steps (Phase 2)

When ready to connect real backend:

1. **Setup Supabase** - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Replace Mock Data** - Connect to Supabase database
3. **Enable Auth** - Activate Google OAuth
4. **Deploy** - Push to Vercel

## Troubleshooting

### Port Already in Use
If port 3000 is busy, Next.js will automatically use 3001:
```
⚠ Port 3000 is in use, trying 3001 instead.
```

### Build Errors
Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

### ESLint Warnings
Minor warnings are OK. To fix:
```bash
npm run lint -- --fix
```

## Tips for Development

1. **Hot Reload**: Save any file and browser auto-refreshes
2. **React DevTools**: Install browser extension for debugging
3. **Mobile Testing**: Open on phone via network IP
4. **Mock Data**: Modify [lib/mock-data.ts](lib/mock-data.ts) to test different scenarios

## Support

- Issues: Report bugs via GitHub Issues
- Questions: Check [README.md](README.md) for detailed info
- Deployment: See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

Happy coding! 🚀
