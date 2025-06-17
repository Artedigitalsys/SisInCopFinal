#!/bin/bash
set -e

echo "=== Render Build (No Docker) ==="
echo "Forcing non-Docker build process"

# Remove any Docker files that might exist
rm -f Dockerfile* docker-compose.yml .dockerignore

# Install dependencies
npm install --include=dev --legacy-peer-deps --no-audit

# Build process
mkdir -p dist/public

# Frontend build
NODE_ENV=production npx vite build --outDir dist/public --mode production

# Backend build
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --target=node20

echo "Build completed successfully!"
echo "Output files:"
ls -la dist/
ls -la dist/public/ | head -3