#!/bin/bash
set -e

echo "=== Ultimate Render Build ==="
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"

# Force clean install with all dependencies
echo "Installing dependencies..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Verify vite is installed
echo "Checking Vite installation..."
npx vite --version || npm install vite --save-dev

# Create build directories
rm -rf dist
mkdir -p dist/public

# Build frontend without complex config
echo "Building frontend..."
npx vite build --outDir dist/public --base=./

# Build backend
echo "Building backend..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --target=node20

# Verify build
echo "Verifying build..."
ls -la dist/
ls -la dist/public/ | head -3

echo "Build completed successfully!"