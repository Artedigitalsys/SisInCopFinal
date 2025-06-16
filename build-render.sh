#!/bin/bash
set -e

echo "Starting Render build process..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Create dist directory
mkdir -p dist/public

# Build frontend with explicit entry point
echo "Building frontend..."
npx vite build --config vite.config.prod.ts --root client --outDir ../dist/public

# Build backend
echo "Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"