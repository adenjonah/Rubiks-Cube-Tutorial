#!/bin/bash

# Start Flask backend
echo "Starting Flask backend..."
cd backend
python -m flask run &
BACKEND_PID=$!
cd ..

# Start React frontend
echo "Setting up React frontend..."
cd frontend

# Check if node_modules exists and install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

echo "Starting React frontend..."
npm start &
FRONTEND_PID=$!
cd ..

# Setup shutdown handler
function cleanup {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

# Catch interrupt signal (Ctrl+C)
trap cleanup INT

echo "Servers are running. Press Ctrl+C to stop."
# Wait indefinitely
while true; do
  sleep 1
done 