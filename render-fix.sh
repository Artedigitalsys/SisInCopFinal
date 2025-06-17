#!/bin/bash
set -e

echo "=== Render Fix Build ==="

# Install ALL dependencies (including dev)
npm install --include=dev

# Verify vite is available
echo "Vite version: $(npx vite --version)"

# Clean build
rm -rf dist
mkdir -p dist/public

# Build using existing package.json script
npm run build

echo "Build completed!"
ls -la dist/