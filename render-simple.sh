#!/bin/bash
set -e

echo "=== Simple Render Build ==="

# Install with dev dependencies 
npm install

# Clean and create directories
rm -rf dist
mkdir -p dist/public

# Build frontend with explicit config
echo "Building frontend..."
NODE_ENV=production npx vite build --config vite.config.ts --outDir dist/public

# Build backend
echo "Building backend..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --target=node20

echo "Build complete!"