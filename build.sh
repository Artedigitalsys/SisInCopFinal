#!/bin/bash
set -e

echo "=== Custom Build Script ==="

# Install dependencies with dev packages
npm install --include=dev --no-audit --no-fund --force

# Clean build directory
rm -rf dist
mkdir -p dist/public

# Build using full paths to avoid PATH issues
echo "Building frontend..."
./node_modules/.bin/vite build --config vite.config.ts --mode production

echo "Building backend..."
./node_modules/.bin/esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --target=node20

echo "Build completed!"
ls -la dist/
ls -la dist/public/ | head -3