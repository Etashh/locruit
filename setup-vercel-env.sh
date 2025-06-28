#!/bin/bash

# Setup Vercel Environment Variables
echo "Setting up Vercel environment variables for locruit-xi6u..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | xargs)
    echo "Loaded environment variables from .env file"
else
    echo "Error: .env file not found!"
    exit 1
fi

# Set the project name
target_project="locruit-xi6u"

# Add environment variables to Vercel with actual values
echo "Adding VITE_SUPABASE_URL..."
echo "$VITE_SUPABASE_URL" | npx vercel env add VITE_SUPABASE_URL production --project $target_project

echo "Adding VITE_SUPABASE_ANON_KEY..."
echo "$VITE_SUPABASE_ANON_KEY" | npx vercel env add VITE_SUPABASE_ANON_KEY production --project $target_project

echo "Adding VITE_GOOGLE_CLIENT_ID..."
echo "$VITE_GOOGLE_CLIENT_ID" | npx vercel env add VITE_GOOGLE_CLIENT_ID production --project $target_project

echo "Adding VITE_GOOGLE_CLIENT_SECRET..."
echo "$VITE_GOOGLE_CLIENT_SECRET" | npx vercel env add VITE_GOOGLE_CLIENT_SECRET production --project $target_project

echo "Environment variables setup complete!"
echo "Redeploying to production..."
npx vercel --prod --project $target_project
