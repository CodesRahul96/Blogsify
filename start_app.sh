#!/usr/bin/env bash

# Blogsify Linux Startup Script
# Starts both the backend server and frontend client concurrently with clean exit handling

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$PROJECT_DIR/server"
CLIENT_DIR="$PROJECT_DIR/client"

echo "=================================================="
echo "          🚀 Starting Blogsify Platform           "
echo "=================================================="

# Check for node and npm
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js is not found in PATH."
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "❌ Error: npm is not found in PATH."
    exit 1
fi

# Check and install server dependencies if missing
if [ ! -d "$SERVER_DIR/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    (cd "$SERVER_DIR" && npm install)
fi

# Check and install client dependencies if missing
if [ ! -d "$CLIENT_DIR/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    (cd "$CLIENT_DIR" && npm install)
fi

# Trap SIGINT (Ctrl+C) and SIGTERM to kill background children cleanly
cleanup() {
    echo -e "\n🛑 Stopping Blogsify..."
    kill $(jobs -p) 2>/dev/null || true
    wait 2>/dev/null || true
    echo "👋 Stopped."
}
trap cleanup SIGINT SIGTERM EXIT

# Start server in background
echo "🔌 Launching Server..."
(cd "$SERVER_DIR" && npm run dev) &
SERVER_PID=$!

# Start client in background
echo "💻 Launching Client..."
(cd "$CLIENT_DIR" && npm run dev) &
CLIENT_PID=$!

echo "✨ Both services are running!"
echo "   - Server API: http://localhost:5000 (or configured PORT)"
echo "   - Client Web: http://localhost:5173"
echo "Press [Ctrl+C] anytime to stop both services."

# Wait for both processes
wait
