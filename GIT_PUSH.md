# Push to GitHub

Your repository is initialized and ready! Here's how to push:

## ✅ What's Done

- ✅ Git repository initialized
- ✅ All files committed
- ✅ Remote added: https://github.com/Ricardobroeders/nutrition-nerd.git
- ✅ Branch renamed to `main`

## 🚀 Push to GitHub

You need to authenticate. Choose one of these methods:

### Option 1: Using GitHub CLI (Recommended)

```bash
gh auth login
git push -u origin main
```

### Option 2: Using SSH

1. Set up SSH key:
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

2. Add SSH key to GitHub:
   - Go to GitHub Settings → SSH Keys
   - Click "New SSH key"
   - Paste your public key

3. Update remote to use SSH:
```bash
git remote set-url origin git@github.com:Ricardobroeders/nutrition-nerd.git
git push -u origin main
```

### Option 3: Using Personal Access Token

1. Create token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Select scopes: `repo`
   - Copy the token

2. Push with token:
```bash
git push -u origin main
# Username: Ricardobroeders
# Password: <paste your token>
```

### Option 4: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Select: `/Users/ricardo/Documents/nutrition-nerd`
4. Click "Publish repository"

## 📊 What Will Be Pushed

```
50 files
11,563 lines of code

Including:
- Complete Next.js app
- Supabase configuration
- All 144 food items
- Documentation (7 markdown files)
- SQL schema and import scripts
```

## ⚠️ Note: .env.local is NOT pushed

Your `.env.local` file with Supabase credentials is gitignored and won't be pushed to GitHub (for security).

When deploying or cloning, you'll need to:
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials

## ✅ After Pushing

Once pushed, your repository will be live at:
**https://github.com/Ricardobroeders/nutrition-nerd**

Then you can:
- Deploy to Vercel directly from GitHub
- Collaborate with others
- Track issues and pull requests
- Set up CI/CD

## 🎯 Quick Command

If you already have GitHub CLI or SSH set up:

```bash
# Check current status
git status

# Push to GitHub
git push -u origin main

# Verify
git remote -v
```

---

**Ready to push!** Use one of the methods above.
