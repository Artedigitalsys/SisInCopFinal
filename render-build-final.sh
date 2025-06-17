#!/bin/bash
set -e

echo "=== Render Build Final ==="
echo "Working in: $(pwd)"
echo "Node: $(node --version)"

# Install all dependencies including dev dependencies for build
npm ci --include=dev --no-audit --no-fund

# Create output directories
mkdir -p dist/public

# Build with vite using production config
echo "Building frontend..."
if [ -f "vite.config.prod.ts" ]; then
    npx vite build --config vite.config.prod.ts --outDir dist/public
else
    npx vite build --config vite.config.ts --outDir dist/public --mode production
fi

# Build backend
echo "Building backend..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --target=node20

echo "Build completed!"
ls -la dist/
ls -la dist/public/ | head -5