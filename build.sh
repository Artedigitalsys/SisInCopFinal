#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Install dependencies
npm install

# Build client
echo "Building client..."
cd client && npx vite build --outDir ../dist/public && cd ..

# Build server
echo "Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"