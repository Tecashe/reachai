#!/bin/bash
# Startup script for Railway deployment

echo "Starting ReachAI Scraper Service..."
echo "Port: ${PORT:-8000}"
echo "Environment: ${RAILWAY_ENVIRONMENT:-production}"

# Start uvicorn with Railway's PORT
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 2 --log-level info
