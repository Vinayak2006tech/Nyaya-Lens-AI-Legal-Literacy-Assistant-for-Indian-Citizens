#!/usr/bin/env bash

# Nyaya Lens (न्याय लेन्स) Unified Startup Script
# AI Legal-Literacy Assistant for Indian Citizens

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================================="
echo "⚖️  NYAYA LENS (न्याय लेन्स) — STARTING ALL SERVICES"
echo "   AI Legal-Literacy Assistant for Indian Citizens"
echo "   Powered by IBM Granite 3 & watsonx.governance"
echo "=========================================================="

# Trap SIGINT to kill background services on exit
cleanup() {
  echo ""
  echo "Shutting down Nyaya Lens services..."
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start Python AI Service on port 8000
echo "🚀 [1/3] Starting AI Service (IBM Granite Engine on port 8000)..."
cd "$DIR/ai-service"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
AI_PID=$!

# Wait for AI service to initialize
sleep 2

# 2. Start Node.js Backend Gateway on port 5001
echo "🚀 [2/3] Starting Backend & WebSocket Gateway (port 5001)..."
cd "$DIR/backend"
npm start &
BE_PID=$!

sleep 2

# 3. Start React Vite Frontend on port 5173
echo "🚀 [3/3] Starting React Frontend Dev Server (port 5173)..."
cd "$DIR/frontend"
npm run dev -- --host &
FE_PID=$!

echo ""
echo "=========================================================="
echo "✅ ALL NYAYA LENS SERVICES ARE ACTIVE!"
echo "   - Frontend UI:       http://localhost:5173"
echo "   - Backend API & WS:  http://localhost:5001"
echo "   - AI Service Docs:   http://localhost:8000/docs"
echo "=========================================================="
echo "Press Ctrl+C to stop all services."

# Keep script running
wait
