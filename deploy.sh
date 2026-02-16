#!/bin/bash

# RapidCSAT One-Click Deploy Script
# Run this on your EC2 server to update the app automatically

PROJECT_DIR="/var/www/csat-project"

echo "Starting Deployment..."

# Navigate to project directory
cd $PROJECT_DIR || { echo "Error: Could not find project directory at $PROJECT_DIR"; exit 1; }

# Fix Git ownership issue
echo "Configuring Git safe directory..."
sudo git config --global --add safe.directory $PROJECT_DIR

# Pull latest changes from GitHub
echo "Pulling latest code from GitHub..."
sudo git pull origin main

# Define Poetry Path (Add common locations to PATH)
export PATH="$HOME/.local/bin:$PATH"

# Install/Update dependencies
echo "Checking dependencies..."
# Use full path for poetry if needed, or assume it's in PATH now
poetry install --no-interaction || /home/ec2-user/.local/bin/poetry install --no-interaction

# Update database tables (just in case model changed)
echo "Syncing database tables..."
poetry run python -c "from app.database import engine, Base; from app.models import Feedback; Base.metadata.create_all(bind=engine)" || \
/home/ec2-user/.local/bin/poetry run python -c "from app.database import engine, Base; from app.models import Feedback; Base.metadata.create_all(bind=engine)"

# Restart the service
echo "Restarting Service..."
sudo systemctl restart csat

echo "Deployment Complete! App is live at https://csat-project.duckdns.org"
echo "--------------------------------------------------------"
echo "To watch logs, run: journalctl -u csat -f"
