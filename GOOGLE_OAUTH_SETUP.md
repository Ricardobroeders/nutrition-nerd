# Google OAuth Setup for Nutrition Nerd

## ✅ What's Done

- ✅ Database tables created (144 food items imported!)
- ✅ Supabase client configured
- ✅ Login page ready with Google OAuth button
- ✅ Auth callback route created
- ✅ App builds successfully

## 🔐 Next: Enable Google OAuth

To enable actual Google login, follow these steps:

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
   - Name: "Nutrition Nerd" or similar
3. Enable **Google+ API**:
   - Search for "Google+ API" in the search bar
   - Click **Enable**

4. Create OAuth Credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: "Nutrition Nerd Web"

5. Add Authorized Redirect URIs:
   ```
   https://upqmrrcczvuwyhdhzwmf.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```

6. Click **Create**
7. Copy your **Client ID** and **Client Secret**

### Step 2: Configure Supabase

1. Open Supabase Dashboard: https://app.supabase.com/project/upqmrrcczvuwyhdhzwmf
2. Go to **Authentication** → **Providers**
3. Find **Google** in the list
4. Click to expand
5. Enable the toggle
6. Paste your Google OAuth credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
7. Click **Save**

### Step 3: Test Login

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Click **"Inloggen met Google"**

4. You should be redirected to Google login

5. After successful login, you'll be redirected back to `/dashboard`

### Step 4: Verify User Creation

After logging in, check that your user was created:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. You should see your Google account listed

3. Check the database:
   ```sql
   SELECT * FROM public.users;
   ```
   You should see a record with your email and display name!

## 🧪 Testing Without OAuth (Temporary)

If you want to test the app before setting up Google OAuth, you can:

### Option 1: Create a Test User via SQL

Run this in Supabase SQL Editor:

```sql
-- First, create a user in auth.users (this simulates a signup)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_current,
  email_change
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Test User"}',
  FALSE,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

-- The user profile will be created automatically by the trigger!
```

Then check:
```sql
SELECT * FROM public.users WHERE email = 'test@example.com';
```

### Option 2: Use Supabase Email Auth (Temporary)

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Email** provider
3. Disable "Confirm email" for testing
4. Update the login page to include email/password login

## 🎯 What Happens After Login

Once logged in successfully:

1. **User Profile Created**: Your profile is automatically created in `public.users` table via a database trigger

2. **Session Persisted**: Supabase stores your session in localStorage

3. **Redirect to Dashboard**: You'll be taken to `/dashboard`

4. **Access to App**: All protected routes become accessible

## 🔒 Security Notes

- **RLS Enabled**: Row Level Security ensures users can only see their own data
- **Secure Session**: Supabase handles session management securely
- **HTTPS Only**: In production, always use HTTPS
- **Token Refresh**: Supabase automatically refreshes tokens

## 🐛 Troubleshooting

### "OAuth configuration not found"
→ Make sure you enabled Google provider in Supabase and saved your credentials

### "Redirect URI mismatch"
→ Check that your redirect URIs in Google Cloud Console match exactly:
   - `https://upqmrrcczvuwyhdhzwmf.supabase.co/auth/v1/callback`

### "User not created in database"
→ Check that the trigger `on_auth_user_created` is enabled:
```sql
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

### "Session not persisting"
→ Clear browser localStorage and cookies, then try again

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## ✅ Next Steps After OAuth Setup

Once Google OAuth is working:

1. Test the complete user flow
2. Update all pages to use Supabase data
3. Deploy to Vercel
4. Update redirect URIs for production domain

---

**Current Status**: Database ready, OAuth pending configuration
**Time to complete**: ~15 minutes
