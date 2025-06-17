#!/bin/bash
set -e

echo "=== Render Ultimate Fix ==="

# Clean environment
export NODE_ENV=production
export DOCKER_BUILDKIT=0

# Install with explicit dev dependencies
npm install --include=dev --no-audit --no-fund --force

# Verify build tools
echo "Verifying build tools..."
npx vite --version
npx esbuild --version

# Clean build
rm -rf dist
mkdir -p dist/public

# Build frontend
echo "Building frontend..."
npx vite build --outDir dist/public --mode production --emptyOutDir

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
echo "Verifying build output..."
ls -la dist/
ls -la dist/public/ | head -3

if [ ! -f "dist/public/index.html" ]; then
  echo "ERROR: Frontend build failed"
  exit 1
fi

if [ ! -f "dist/index.js" ]; then
  echo "ERROR: Backend build failed" 
  exit 1
fi

echo "Build completed successfully!"