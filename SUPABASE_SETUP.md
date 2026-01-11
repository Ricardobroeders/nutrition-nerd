# Supabase Setup Instructions

## ✅ Completed Steps

1. ✅ Environment variables created (`.env.local`)
2. ✅ Supabase dependencies installed
3. ✅ Database schema ready (`supabase/schema.sql`)
4. ✅ Food items import script ready (`supabase/import-food-items.sql`)
5. ✅ Supabase client configured (`lib/supabase.ts`)

## 🔧 Steps to Complete (Do This Now)

### Step 1: Create the Database Tables

1. Open your Supabase Dashboard: https://app.supabase.com/project/upqmrrcczvuwyhdhzwmf
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `/Users/ricardo/Documents/nutrition-nerd/supabase/schema.sql`
5. Copy ALL the contents and paste into the SQL Editor
6. Click **Run** (or press Cmd+Enter)
7. You should see: "Success. No rows returned"

This creates:
- ✅ 4 tables (users, food_items, user_intake, weekly_stats)
- ✅ All indexes
- ✅ Row Level Security policies
- ✅ Automatic user creation trigger
- ✅ Update timestamp triggers

### Step 2: Import Food Items

1. Still in **SQL Editor**
2. Click **New query** again
3. Open the file `/Users/ricardo/Documents/nutrition-nerd/supabase/import-food-items.sql`
4. Copy ALL the contents and paste into the SQL Editor
5. Click **Run**
6. You should see: "Success. No rows returned"

This inserts all 145 food items from your CSV!

### Step 3: Verify the Import

Run this query in SQL Editor:

```sql
SELECT type, COUNT(*) as count
FROM public.food_items
GROUP BY type
ORDER BY type;
```

You should see:
```
fruit    | 125
groente  | 20
```

Also check a few items:

```sql
SELECT * FROM public.food_items
WHERE name_nl IN ('Appel', 'Banaan', 'Tomaat', 'Wortel')
ORDER BY name_nl;
```

### Step 4: Test the Connection

The app is now ready to connect! Let's test it:

```bash
npm run dev
```

Open http://localhost:3000

**Note**: The login won't work yet because Google OAuth isn't configured. We'll do that next.

## 🔐 Optional: Enable Google OAuth (For Later)

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `https://upqmrrcczvuwyhdhzwmf.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
7. Copy your **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to enable
3. Paste your **Client ID** and **Client Secret**
4. Click **Save**

### Step 3: Create Auth Callback Page

This is already prepared but commented. Once OAuth is enabled, the login will work automatically!

## 📊 Database Structure

Your database now has:

### `users` table
- Stores user profiles (created automatically on signup)
- Tracks streaks (current_streak, longest_streak)
- Links to auth.users via id

### `food_items` table
- 145 items from your CSV
- Each has: name_nl, type (fruit/groente), nutrient
- Searchable and filterable

### `user_intake` table
- Tracks what users eat each day
- Unique constraint: user + food_item + date
- Links to users and food_items

### `weekly_stats` table
- Tracks weekly unique item counts
- Used for streak calculations
- Updates automatically

## 🧪 Testing Queries

### Get all food items
```sql
SELECT * FROM public.food_items ORDER BY name_nl LIMIT 10;
```

### Check RLS policies
```sql
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### View triggers
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

## 🔄 Next Steps

After database setup:
1. ✅ Database is ready
2. ⏳ Configure Google OAuth (optional - for production)
3. ⏳ Update app pages to use Supabase (I'll do this next)
4. ⏳ Test the complete flow
5. ⏳ Deploy to Vercel

## 🐛 Troubleshooting

### Error: relation "public.users" already exists
```sql
-- Drop and recreate
DROP TABLE IF EXISTS public.user_intake CASCADE;
DROP TABLE IF EXISTS public.weekly_stats CASCADE;
DROP TABLE IF EXISTS public.food_items CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
```
Then run `schema.sql` again.

### Error: duplicate key value violates unique constraint
The food items are already imported. This is fine! The SQL has `ON CONFLICT DO NOTHING`.

### Can't see any data
Check RLS policies:
```sql
-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE public.food_items DISABLE ROW LEVEL SECURITY;
```

Then check if data is there:
```sql
SELECT COUNT(*) FROM public.food_items;
```

If data is there, re-enable RLS:
```sql
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
```

## 📞 Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check `/supabase/README.md` for additional info
