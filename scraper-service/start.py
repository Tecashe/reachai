#!/usr/bin/env python3
import os
import sys
import uvicorn

if __name__ == "__main__":
    # Get port from environment variable, default to 8000
    port = int(os.getenv("PORT", "8000"))
    
    print(f"[v0] Starting server on port {port}")
    print(f"[v0] Environment PORT variable: {os.getenv('PORT', 'not set')}")
    
    # Start uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        workers=1,  # Use 1 worker for Railway's free tier
        log_level="info"
    )
