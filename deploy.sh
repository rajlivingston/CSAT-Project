#!/bin/bash

# RapidCSAT One-Click Deploy Script
# Run this on your EC2 server to update the app automatically

PROJECT_DIR="/var/www/csat-project"

echo "🚀 Starting Deployment..."

# Navigate to project directory
cd $PROJECT_DIR || { echo "❌ Error: Could not find project directory at $PROJECT_DIR"; exit 1; }

# Pull latest changes from GitHub
echo "🔄 Pulling latest code from GitHub..."
sudo git pull origin main

# Install/Update dependencies
echo "📦 Checking dependencies..."
poetry install --no-interaction

# Update database tables (just in case model changed)
echo "🗄️ Syncing database tables..."
poetry run python -c "from app.database import engine, Base; from app.models import Feedback; Base.metadata.create_all(bind=engine)"

# Restart the service
echo "🔄 Restarting Service..."
sudo systemctl restart csat

echo "✅ Deployment Complete! App is live at https://csat-project.duckdns.org"
echo "--------------------------------------------------------"
echo "To watch logs, run: journalctl -u csat -f"
