#!/bin/bash

# Railway deployment script for Adzuna Scraper

echo "🚂 Deploying Adzuna Scraper to Railway..."

# Create a temporary directory for deployment
mkdir -p railway-deploy
cd railway-deploy

# Copy necessary files
cp ../adzunaScraper.cjs .
cp ../scraper-package.json ./package.json

# Create Railway configuration
cat > railway.toml << EOF
[build]
builder = "nixpacks"

[deploy]
startCommand = "node adzunaScraper.cjs"
restartPolicyType = "always"
EOF

echo "✅ Files prepared for Railway deployment"
echo "📁 Files in railway-deploy directory:"
ls -la

echo ""
echo "🔧 Next steps:"
echo "1. Go to https://railway.app"
echo "2. Create new project from GitHub repo"
echo "3. Deploy and get your Railway URL"
echo "4. Update your .env file with: VITE_API_URL=https://your-app.railway.app"
echo "5. Redeploy your Vercel frontend"
