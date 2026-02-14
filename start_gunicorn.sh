#!/bin/bash
# Start Gunicorn server
# Binding to 127.0.0.1:8000 (Nginx will proxy to this)
# Workers: 4 (adjust based on CPU cores)
# Module: app.main:app

echo "Starting Gunicorn on port 8000..."
poetry run gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
