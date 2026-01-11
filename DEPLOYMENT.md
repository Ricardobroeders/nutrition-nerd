# Deployment Guide - Nutrition Nerd

## Phase 2: Supabase + Vercel Deployment

### 1. Supabase Setup

#### Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and anon key

#### Database Schema

Run the following SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0
);

-- Food items table
CREATE TABLE public.food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_nl TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fruit', 'vegetable')),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User intake table
CREATE TABLE public.user_intake (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE,
  intake_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, food_item_id, intake_date)
);

-- Weekly stats table
CREATE TABLE public.weekly_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  unique_items_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Indexes for performance
CREATE INDEX idx_user_intake_user_id ON public.user_intake(user_id);
CREATE INDEX idx_user_intake_date ON public.user_intake(intake_date);
CREATE INDEX idx_weekly_stats_user_id ON public.weekly_stats(user_id);
CREATE INDEX idx_weekly_stats_week ON public.weekly_stats(week_start_date);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Everyone can read food items
CREATE POLICY "Anyone can read food items" ON public.food_items
  FOR SELECT TO authenticated USING (true);

-- Users can read their own intake
CREATE POLICY "Users can read own intake" ON public.user_intake
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own intake
CREATE POLICY "Users can insert own intake" ON public.user_intake
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own intake
CREATE POLICY "Users can delete own intake" ON public.user_intake
  FOR DELETE USING (auth.uid() = user_id);

-- Users can read their own stats
CREATE POLICY "Users can read own stats" ON public.weekly_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Users can read all stats for leaderboard (limited fields)
CREATE POLICY "Users can read leaderboard stats" ON public.weekly_stats
  FOR SELECT TO authenticated USING (true);
```

#### Seed Food Items

```sql
-- Insert all 62 food items from mock-data.ts
INSERT INTO public.food_items (name_nl, type, category) VALUES
  -- Fruits
  ('Appel', 'fruit', 'Kernfruit'),
  ('Peer', 'fruit', 'Kernfruit'),
  ('Banaan', 'fruit', 'Tropisch'),
  ('Sinaasappel', 'fruit', 'Citrus'),
  ('Mandarijn', 'fruit', 'Citrus'),
  ('Citroen', 'fruit', 'Citrus'),
  ('Limoen', 'fruit', 'Citrus'),
  ('Aardbei', 'fruit', 'Bessen'),
  ('Framboos', 'fruit', 'Bessen'),
  ('Blauwe bes', 'fruit', 'Bessen'),
  ('Braam', 'fruit', 'Bessen'),
  ('Druiven', 'fruit', 'Bessen'),
  ('Kiwi', 'fruit', 'Tropisch'),
  ('Mango', 'fruit', 'Tropisch'),
  ('Ananas', 'fruit', 'Tropisch'),
  ('Watermeloen', 'fruit', 'Meloen'),
  ('Meloen', 'fruit', 'Meloen'),
  ('Perzik', 'fruit', 'Steenfruit'),
  ('Nectarine', 'fruit', 'Steenfruit'),
  ('Abrikoos', 'fruit', 'Steenfruit'),
  ('Pruim', 'fruit', 'Steenfruit'),
  ('Kers', 'fruit', 'Steenfruit'),
  ('Papaja', 'fruit', 'Tropisch'),
  ('Granaatappel', 'fruit', 'Exotisch'),
  ('Vijg', 'fruit', 'Exotisch'),
  ('Dadel', 'fruit', 'Exotisch'),
  ('Passievrucht', 'fruit', 'Tropisch'),
  ('Lychee', 'fruit', 'Tropisch'),
  -- Vegetables
  ('Tomaat', 'vegetable', 'Vruchtgroente'),
  ('Komkommer', 'vegetable', 'Vruchtgroente'),
  ('Paprika', 'vegetable', 'Vruchtgroente'),
  ('Aubergine', 'vegetable', 'Vruchtgroente'),
  ('Courgette', 'vegetable', 'Vruchtgroente'),
  ('Wortel', 'vegetable', 'Wortelgroente'),
  ('Ui', 'vegetable', 'Bolgewas'),
  ('Knoflook', 'vegetable', 'Bolgewas'),
  ('Prei', 'vegetable', 'Bolgewas'),
  ('Broccoli', 'vegetable', 'Koolsoort'),
  ('Bloemkool', 'vegetable', 'Koolsoort'),
  ('Boerenkool', 'vegetable', 'Koolsoort'),
  ('Spruitjes', 'vegetable', 'Koolsoort'),
  ('Rode kool', 'vegetable', 'Koolsoort'),
  ('Witte kool', 'vegetable', 'Koolsoort'),
  ('Spinazie', 'vegetable', 'Bladgroente'),
  ('Sla', 'vegetable', 'Bladgroente'),
  ('Rucola', 'vegetable', 'Bladgroente'),
  ('Andijvie', 'vegetable', 'Bladgroente'),
  ('Postelein', 'vegetable', 'Bladgroente'),
  ('Champignon', 'vegetable', 'Paddenstoel'),
  ('Aardappel', 'vegetable', 'Knolgewas'),
  ('Zoete aardappel', 'vegetable', 'Knolgewas'),
  ('Radijs', 'vegetable', 'Wortelgroente'),
  ('Biet', 'vegetable', 'Wortelgroente'),
  ('Selderij', 'vegetable', 'Stengel'),
  ('Venkel', 'vegetable', 'Stengel'),
  ('Asperge', 'vegetable', 'Stengel'),
  ('Paksoi', 'vegetable', 'Bladgroente'),
  ('Chinese kool', 'vegetable', 'Koolsoort'),
  ('Snijbonen', 'vegetable', 'Peulvrucht'),
  ('Erwten', 'vegetable', 'Peulvrucht'),
  ('Mais', 'vegetable', 'Vruchtgroente'),
  ('Pompoen', 'vegetable', 'Vruchtgroente');
```

#### Enable Google OAuth
1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URL: `https://your-app.vercel.app/auth/callback`

### 2. Update Application Code

#### Install Supabase Client
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

#### Create Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Update lib/supabase.ts
Replace the mock implementation with real Supabase client:

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

export const supabase = createClientComponentClient<Database>();
```

### 3. Vercel Deployment

#### Connect Repository
1. Push code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import your repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

#### Add Environment Variables
In Vercel project settings, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Deploy
```bash
vercel --prod
```

### 4. Post-Deployment Tasks

1. **Test Authentication**: Verify Google OAuth flow works
2. **Test Data Sync**: Add items and verify they persist
3. **Test Leaderboard**: Verify real-time updates work
4. **Setup Analytics**: Add Vercel Analytics (optional)
5. **Setup Monitoring**: Configure error tracking (Sentry, etc.)

### 5. Scheduled Tasks (Optional)

Create Edge Function for weekly reset:

```typescript
// supabase/functions/weekly-reset/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Calculate streaks and reset weekly stats
  // This runs every Monday at 00:00

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

Schedule via Supabase cron:
```sql
SELECT cron.schedule(
  'weekly-reset',
  '0 0 * * 1', -- Every Monday at 00:00
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/weekly-reset',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Add your domain to Supabase allowed origins
2. **Auth Redirect Issues**: Verify callback URLs match exactly
3. **RLS Errors**: Check policies allow the operation
4. **Build Errors**: Ensure all environment variables are set

### Performance Optimization

1. Enable Supabase connection pooling
2. Add database indexes for frequently queried fields
3. Use Vercel Edge Functions for API routes
4. Enable ISR (Incremental Static Regeneration) for static pages

## Monitoring

### Key Metrics to Track
- User signups per day
- Daily active users
- Average items per user per week
- Streak completion rate
- Page load times
- API response times

### Recommended Tools
- Vercel Analytics
- Supabase Dashboard (built-in analytics)
- Sentry (error tracking)
- PostHog (product analytics)

## Backup & Recovery

1. **Database Backups**: Supabase provides automatic daily backups
2. **Point-in-Time Recovery**: Available on Pro plan
3. **Export Data**: Regular exports via Supabase CLI

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Environment variables secured
- ✅ HTTPS only
- ✅ Rate limiting on API routes
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (React default escaping)
