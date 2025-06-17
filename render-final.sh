#!/bin/bash
set -e

echo "=== Render Final Build Script ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Working directory: $(pwd)"
echo "Directory contents:"
ls -la

# Force specific Node version if nvm is available
if command -v nvm &> /dev/null; then
    echo "Using nvm to set Node version..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 20.18.1 || nvm install 20.18.1
fi

# Clean install
echo "Installing dependencies..."
npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

# Fix only critical vulnerabilities
npm audit fix --only=prod || echo "Audit completed"

# Build process
echo "Starting build process..."
mkdir -p dist/public

# Build frontend
echo "Building frontend..."
if [ -d "client" ]; then
    cd client
    npx vite build --outDir ../dist/public --mode production
    cd ..
else
    echo "Client directory not found, building from root..."
    npx vite build --outDir dist/public --mode production
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

echo "Build completed successfully!"
echo "Frontend files: $(ls -la dist/public | wc -l) files"
echo "Backend files: $(ls -la dist | grep -v public | wc -l) files"