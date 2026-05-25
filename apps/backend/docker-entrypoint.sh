#!/bin/sh
set -e

echo "Building @uno/shared..."
npm run build --workspace=@uno/shared

echo "Applying database schema..."
npx prisma db push --accept-data-loss

cd /app
echo "Starting backend dev server..."
exec npm run dev --workspace=@uno/backend
