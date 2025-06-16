#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Render build process...');

try {
  // Check if client/index.html exists
  if (!fs.existsSync('client/index.html')) {
    console.error('Error: client/index.html not found');
    process.exit(1);
  }

  // Build frontend using the production config
  console.log('Building frontend...');
  execSync('npx vite build --config vite.config.prod.ts', { stdio: 'inherit' });
  
  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}