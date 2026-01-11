# Nutrition Nerd - Groente & Fruit Tracker

Een Nederlandse web applicatie voor het bijhouden van dagelijkse groente en fruit intake met gamification features zoals streaks, leaderboards en prestaties.

## 🚀 Features

### Huidige Features (Phase 1 - Mock Data)
- ✅ **Authenticatie**: Mock login systeem (Google OAuth placeholder)
- ✅ **Dashboard**: Overzicht met huidige streak, weekvoortgang, en quick add functie
- ✅ **Voedsel Zoeken**: Zoek en filter 62 Nederlandse groente en fruit items
- ✅ **Mijn Intake**: Kalender weergave met dagelijkse intake geschiedenis
- ✅ **Klassement**: Wekelijkse en overall ranglijst top 20
- ✅ **Profiel**: Persoonlijke statistieken en account beheer
- ✅ **Streak Systeem**: 🔥 Track wekelijkse streaks met 25+ unieke items doel
- ✅ **Responsive Design**: Mobile-first met dedicated navigatie

### Toekomstige Features (Phase 2 - Supabase Integration)
- 🔜 Supabase PostgreSQL database connectie
- 🔜 Google OAuth authenticatie via Supabase
- 🔜 Real-time data synchronisatie
- 🔜 Vercel deployment

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ (App Router)
- **Taal**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend (toekomst)**: Supabase
- **Hosting (toekomst)**: Vercel

## 📦 Installation

```bash
# Clone de repository
git clone <repository-url>
cd nutrition-nerd

# Installeer dependencies
npm install

# Start development server
npm run dev

# Open browser naar http://localhost:3000
```

## 🏗 Project Structuur

```
nutrition-nerd/
├── app/
│   ├── (auth)/
│   │   └── login/          # Login pagina
│   ├── (protected)/
│   │   ├── dashboard/      # Dashboard met quick add
│   │   ├── zoeken/         # Voedsel zoeken pagina
│   │   ├── intake/         # Intake geschiedenis
│   │   ├── klassement/     # Leaderboard
│   │   ├── profiel/        # Profiel pagina
│   │   └── layout.tsx      # Protected layout met navigatie
│   ├── globals.css         # Global styles & theme
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Redirect naar login
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── food-search.tsx     # Zoek & filter component
│   ├── intake-calendar.tsx # Kalender component
│   ├── leaderboard-table.tsx # Ranglijst component
│   └── streak-indicator.tsx  # Streak display component
├── lib/
│   ├── mock-data.ts        # Mock data (62 items)
│   ├── streak-utils.ts     # Streak calculation logic
│   ├── supabase.ts         # Supabase placeholder
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript interfaces
```

## 🎯 Hoe het werkt

### Streak Systeem
- **Doel**: 25+ unieke groente/fruit items per week
- **Streak +1**: Bij het behalen van het weekdoel
- **Streak reset**: Bij missen van het weekdoel
- **Week start**: Maandag 00:00

### Leaderboard
- **Deze Week**: Reset elke maandag, gebaseerd op unieke items deze week
- **Altijd**: Totaal unieke items ooit gegeten
- Top 20 gebruikers zichtbaar

### Data Model

**User**
- Huidige streak & langste streak
- Display name & email
- Account creation datum

**FoodItem** (62 items)
- Nederlandse naam
- Type: fruit of groente
- Categorie (Citrus, Kernfruit, Bladgroente, etc.)

**UserIntake**
- Unieke combinatie: user + food_item + datum
- Timestamp van toevoeging

## 🎨 Design Systeem

### Kleuren
- **Primary**: Emerald (#10b981, #065f46) - groente/gezondheid thema
- **Accents**: Yellow (streak badges), Purple (statistics)
- **Status**: Red (destructive), Blue (info), Orange (warnings)

### Typography
- Font: Inter
- Mobile-first responsive sizing

### Components
Alle UI components via shadcn/ui:
- Button, Card, Input, Badge
- Tabs, Avatar, Progress
- Responsive & accessible

## 🔄 Phase 2 Roadmap

### Supabase Setup
1. Create Supabase project
2. Setup database schema (users, food_items, user_intake, weekly_stats)
3. Enable Row Level Security (RLS)
4. Configure Google OAuth

### Migration Steps
```bash
# Install Supabase client
npm install @supabase/supabase-js

# Update .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Code Updates Needed
1. Replace mock data in `/lib/supabase.ts`
2. Update auth context with real Supabase auth
3. Replace local state with Supabase queries
4. Add optimistic UI updates
5. Implement real-time subscriptions

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🧪 Testing

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## 📱 Browser Support

- Chrome/Edge (laatste 2 versies)
- Firefox (laatste 2 versies)
- Safari (laatste 2 versies)
- Mobile Safari (iOS 14+)
- Mobile Chrome (Android 10+)

## 🤝 Contributing

Dit is een prototype. Voor productie gebruik:
1. Implementeer Supabase backend
2. Voeg error handling toe
3. Voeg loading states toe
4. Implementeer data validatie
5. Voeg unit tests toe

## 📄 License

MIT

## 🐛 Known Limitations (Mock Phase)

- Data wordt niet opgeslagen (verdwijnt bij refresh)
- Geen echte authenticatie
- Geen data synchronisatie tussen users
- Leaderboard is statisch
- Geen image uploads voor profile

Deze limitaties worden opgelost in Phase 2 met Supabase integratie.
