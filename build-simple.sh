#!/bin/bash
set -e

echo "=== Simple Render Build ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"

# Install dependencies without audit issues
npm install --no-audit --no-fund

# Create output directory
mkdir -p dist/public

# Build frontend directly with vite
echo "Building frontend..."
npx vite build --config vite.config.prod.ts --outDir dist/public

# Build backend with esbuild
echo "Building backend..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --target=node20

echo "Build completed successfully!"
echo "Files created:"
ls -la dist/
ls -la dist/public/