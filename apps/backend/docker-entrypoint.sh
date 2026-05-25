#!/bin/sh
set -e

echo "Building @uno/shared..."
npm run build --workspace=@uno/shared

echo "Generating Prisma client..."
cd /app/apps/backend
npx prisma generate

echo "Applying database schema..."
npx prisma db push --accept-data-loss

cd /app
echo "Starting backend dev server..."
exec npm run dev --workspace=@uno/backend
