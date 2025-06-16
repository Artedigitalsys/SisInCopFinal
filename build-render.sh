#!/bin/bash
set -e

echo "Starting Render build process..."
echo "Working directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Install dependencies and fix vulnerabilities
echo "Installing dependencies..."
npm install --production=false
npm audit fix --force || echo "Audit fix completed with warnings"

# Create dist directory
mkdir -p dist/public

# Verify client directory exists
if [ ! -d "client" ]; then
    echo "Error: client directory not found"
    echo "Available directories:"
    ls -la
    exit 1
fi

# Build frontend
echo "Building frontend..."
if [ -f "client/index.html" ]; then
    npx vite build --root client --outDir ../dist/public
else
    echo "Error: client/index.html not found"
    ls -la client/
    exit 1
fi

# Build backend
echo "Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"
echo "Built files:"
ls -la dist/