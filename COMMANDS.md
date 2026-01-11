# Nutrition Nerd - Command Reference

Quick reference for all available commands.

## 📦 Package Management

```bash
# Install all dependencies
npm install

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Install specific package
npm install <package-name>
```

## 🚀 Development

```bash
# Start development server (http://localhost:3000)
npm run dev

# Start on specific port
PORT=3001 npm run dev

# Development with turbo mode
npm run dev -- --turbo
```

## 🏗️ Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Build and start
npm run build && npm start

# Clean build cache
rm -rf .next && npm run build
```

## 🧹 Code Quality

```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint -- --fix

# Type check (no emit)
npx tsc --noEmit

# Format code (if prettier is installed)
npx prettier --write .
```

## 🧪 Testing (Future)

```bash
# Run tests (not configured yet)
# npm test

# Run tests in watch mode
# npm test -- --watch

# Run tests with coverage
# npm test -- --coverage
```

## 🎨 Tailwind CSS

```bash
# Watch Tailwind changes (automatic with dev server)
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --watch

# Build Tailwind CSS
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --minify
```

## 🎨 shadcn/ui Components

```bash
# Add new component
npx shadcn-ui@latest add [component-name]

# Examples:
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add calendar

# Initialize shadcn/ui (already done)
npx shadcn-ui@latest init
```

## 🗄️ Supabase (Phase 2)

```bash
# Install Supabase client
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Install Supabase CLI (global)
npm install -g supabase

# Login to Supabase
supabase login

# Initialize Supabase project
supabase init

# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Generate TypeScript types from database
supabase gen types typescript --project-id your-project-id > types/supabase.ts

# Push database migrations
supabase db push

# Create new migration
supabase migration new migration_name
```

## 🚀 Vercel Deployment

```bash
# Install Vercel CLI (global)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# Get deployment URL
vercel inspect <deployment-url>

# Pull environment variables
vercel env pull .env.local

# Add environment variable
vercel env add NEXT_PUBLIC_SUPABASE_URL
```

## 🔍 Debugging

```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Reinstall node_modules
rm -rf node_modules && npm install

# Check bundle size
npm run build -- --analyze

# Inspect production build
npm run build && npm start
```

## 📊 Performance Analysis

```bash
# Bundle analyzer (requires @next/bundle-analyzer)
npm install --save-dev @next/bundle-analyzer
npm run build -- --analyze

# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Check package size
npx size-limit
```

## 🗂️ File Operations

```bash
# Find all TypeScript files
find . -name "*.tsx" -o -name "*.ts"

# Count lines of code
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Search for text in files
grep -r "searchterm" ./app ./components

# List all pages
find app -name "page.tsx"

# List all components
find components -name "*.tsx"
```

## 🐛 Git Commands (If using Git)

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Nutrition Nerd app"

# Create GitHub repo and push
gh repo create nutrition-nerd --public --source=. --push

# Or with regular git
git remote add origin https://github.com/username/nutrition-nerd.git
git push -u origin main

# Create new branch
git checkout -b feature/new-feature

# View status
git status

# View changes
git diff
```

## 📱 Mobile Testing

```bash
# Get local IP
# macOS/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows:
ipconfig

# Start dev server accessible on network
npm run dev -- --hostname 0.0.0.0

# Access from mobile: http://192.168.x.x:3000
```

## 🔧 Troubleshooting Commands

```bash
# Fix port already in use
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Check Node version
node --version

# Check npm version
npm --version

# Update Node (using nvm)
nvm install --lts
nvm use --lts

# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## 📚 Documentation Generation

```bash
# Generate component documentation (if storybook is added)
# npm run storybook

# Generate TypeDoc (if typedoc is added)
# npx typedoc --out docs
```

## 🔐 Environment Variables

```bash
# Copy example env file
cp .env.example .env.local

# View environment in development
# Variables are logged on server start

# Check which env vars are loaded
node -e "console.log(process.env)" | grep NEXT_PUBLIC
```

## 📦 Export Static Site (If needed)

```bash
# Add to package.json scripts:
# "export": "next build && next export"

# Then run:
npm run export

# Output will be in /out directory
```

## 🎯 Common Workflows

### Starting Fresh Development
```bash
npm install
npm run dev
```

### Preparing for Deployment
```bash
npm run lint
npm run build
npm start  # Test production locally
vercel --prod  # Deploy
```

### Adding New Feature
```bash
git checkout -b feature/new-feature
# Make changes
npm run build  # Test build
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

### Updating Dependencies
```bash
npm outdated
npm update
npm run build  # Verify nothing broke
npm test  # If tests exist
```

---

**Tip**: Add these commands to your IDE for quick access!
