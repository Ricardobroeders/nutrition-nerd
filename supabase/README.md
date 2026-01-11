# Supabase Database Setup

## Step 1: Run the Schema

1. Open your Supabase Dashboard: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of `schema.sql` and paste it
5. Click **Run** (or press Cmd/Ctrl + Enter)

This will create:
- 4 tables: `users`, `food_items`, `user_intake`, `weekly_stats`
- Indexes for performance
- Row Level Security policies
- Triggers for automatic user creation and timestamp updates

## Step 2: Import Food Items

1. Still in **SQL Editor**
2. Create another new query
3. Copy the contents of `import-food-items.sql` and paste it
4. Click **Run**

This will insert all 145 fruits and vegetables from your CSV.

## Step 3: Verify the Data

Run this query to verify:

```sql
SELECT type, COUNT(*) as count
FROM public.food_items
GROUP BY type;
```

You should see:
- fruit: ~125 items
- groente: ~20 items

## Step 4: Enable Google OAuth (Optional - for later)

1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Follow the instructions to set up Google OAuth credentials
4. Add your redirect URL: `http://localhost:3000/auth/callback` (for dev)

## Troubleshooting

### If tables already exist
```sql
-- Drop all tables (careful - this deletes all data!)
DROP TABLE IF EXISTS public.user_intake CASCADE;
DROP TABLE IF EXISTS public.weekly_stats CASCADE;
DROP TABLE IF EXISTS public.food_items CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
```

Then run the schema.sql again.

### Check table structure
```sql
SELECT * FROM public.food_items LIMIT 10;
SELECT * FROM public.users LIMIT 10;
```

### Check RLS policies
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

## Next Steps

After setting up the database:
1. The app will automatically connect using your .env.local credentials
2. Users will be created automatically when they sign in
3. Food items are ready to be added to intake
4. Streaks will be calculated based on weekly_stats
