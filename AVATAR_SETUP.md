# Avatar Setup Guide

This guide explains how to add Google avatar support to your Nutrition Nerd app.

## Overview

Users who sign in with Google will automatically have their Google profile picture displayed in the leaderboards. The avatar URL is stored in the `users` table and fetched from Google's OAuth data during authentication.

## Database Migration

Run the SQL migration to add the `avatar_url` column and update the trigger function:

### Option 1: Using Supabase SQL Editor

1. Go to: https://app.supabase.com/project/_/sql
2. Copy and paste the contents of: `supabase/add_avatar_url.sql`
3. Click "Run"

### Option 2: Using psql command line

```bash
psql -h your-supabase-host -U postgres -d postgres -f supabase/add_avatar_url.sql
```

## What the Migration Does

1. **Adds `avatar_url` column** to the `users` table
2. **Updates `handle_new_user()` function** to automatically capture the Google avatar URL from OAuth metadata when users sign up

## How It Works

### User Sign-Up Flow

1. User signs in with Google OAuth
2. Supabase receives user data including `raw_user_meta_data->>'avatar_url'`
3. The `handle_new_user()` trigger automatically:
   - Creates a user record in `public.users`
   - Stores the avatar URL from Google
   - Falls back to initials if no avatar is available

### Display in Leaderboards

The avatar is displayed in all three leaderboards:
- Totaal Unieke Items
- Gemiddelde Per Week
- Wekelijkse Streaks

The `LeaderboardTable` component uses the shadcn/ui `Avatar` component with:
- `AvatarImage`: Shows Google profile picture if available
- `AvatarFallback`: Shows user initials with emerald background if no avatar

## Testing

After running the migration:

1. **Existing users**: Will have `avatar_url = NULL` and see their initials
2. **New users**: Will automatically get their Google avatar on sign-up
3. **To update existing users**: You can manually update their avatar URLs if you have them stored in `auth.users.raw_user_meta_data`

### Manually updating existing user avatars (optional)

```sql
-- Update avatar_url for existing users from auth metadata
UPDATE public.users u
SET avatar_url = (
  SELECT raw_user_meta_data->>'avatar_url'
  FROM auth.users au
  WHERE au.id = u.id
)
WHERE avatar_url IS NULL;
```

## Code Changes

The following files were updated:

1. **lib/supabase.ts**: Added `avatar_url` to all leaderboard queries
2. **components/leaderboard-table.tsx**: Added `AvatarImage` component and avatar_url prop
3. **app/(protected)/klassement/page.tsx**: Pass avatar_url to leaderboard entries
4. **supabase/add_avatar_url.sql**: Database migration script

## Troubleshooting

### Avatars not showing for new users

Check if Google OAuth is providing the avatar URL:

```sql
SELECT
  id,
  email,
  raw_user_meta_data->>'avatar_url' as google_avatar
FROM auth.users
WHERE raw_user_meta_data->>'avatar_url' IS NOT NULL;
```

### Avatar shows briefly then disappears

This could be a CORS issue with Google's CDN. The avatar URLs from Google should work without CORS configuration, but if you see issues, check the browser console for errors.
