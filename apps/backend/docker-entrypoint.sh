#!/bin/sh
set -e

echo "Building @uno/shared..."
npm run build --workspace=@uno/shared

cd /app
echo "Starting backend dev server..."
exec npm run dev --workspace=@uno/backend
