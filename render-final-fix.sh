#!/bin/bash
set -e

echo "=== Render Final Fix ==="

# Install with dev dependencies explicitly
npm install --include=dev --no-optional

# Verify critical build tools
echo "Verifying build tools..."
npx vite --version
npx esbuild --version

# Clean and prepare
rm -rf dist
mkdir -p dist/public

# Build frontend with explicit environment
echo "Building frontend..."
NODE_ENV=production npx vite build --outDir dist/public --emptyOutDir

# Build backend
echo "Building backend..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --target=node20

# Verify output
echo "Build verification:"
ls -la dist/
ls -la dist/public/ | head -5

echo "Build successful!"