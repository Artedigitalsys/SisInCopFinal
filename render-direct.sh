#!/bin/bash
set -e

echo "=== Direct Render Build ==="

# Install all dependencies including dev
npm install --include=dev --no-audit --no-fund

# Clean and create directories
rm -rf dist
mkdir -p dist/public

# Build with PATH explicitly set
export PATH="$PWD/node_modules/.bin:$PATH"

# Build frontend
echo "Building frontend..."
vite build --config vite.config.ts --mode production

# Build backend
echo "Building backend..."
esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --target=node20

echo "Build completed successfully!"