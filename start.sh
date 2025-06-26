#!/bin/bash
echo "Installing API dependencies..."
npm install express@^4.18.2 axios@^1.6.2 cors@^2.8.5 --no-package-lock
echo "Starting Adzuna API server..."
node adzunaScraper.cjs
