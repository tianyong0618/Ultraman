#!/bin/bash
cd "$(dirname "$0")"
pkill -f "vite" 2>/dev/null
nohup npm run dev > /tmp/vite.log 2>&1 &
sleep 2

if lsof -i :5173 > /dev/null 2>&1; then
  echo "✅ Server running at http://localhost:5173"
else
  echo "❌ Server failed to start"
  cat /tmp/vite.log
  exit 1
fi