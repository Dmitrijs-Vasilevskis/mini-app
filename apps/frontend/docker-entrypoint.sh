#!/bin/sh
set -e

echo "Building @uno/shared..."
npm run build --workspace=@uno/shared

echo "Starting frontend dev server..."
exec npm run dev --workspace=@uno/frontend
