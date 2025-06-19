#!/bin/bash

# Kill any existing processes on port 5000
echo "Checking for existing processes on port 5000..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Start the WebSocket server in the background
echo "Starting WebSocket server..."
cd server && npm start &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 3

# Start the Next.js development server
echo "Starting Next.js development server..."
cd /home/toad/Projects/AnalysisApp && npm run dev &
FRONTEND_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo "Shutting down servers..."
    kill $SERVER_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "Both servers are running!"
echo "WebSocket server: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
