const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Render build process...');
console.log('Working directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync('.'));

try {
  // Fix npm vulnerabilities first
  console.log('Fixing npm vulnerabilities...');
  execSync('npm audit fix --force', { stdio: 'inherit' });

  // Create dist directory
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  if (!fs.existsSync('dist/public')) {
    fs.mkdirSync('dist/public', { recursive: true });
  }

  // Check if client directory exists
  if (!fs.existsSync('client')) {
    console.error('Error: client directory not found');
    console.log('Available directories:', fs.readdirSync('.').filter(item => 
      fs.statSync(item).isDirectory()
    ));
    process.exit(1);
  }

  // Build frontend with full path
  console.log('Building frontend...');
  execSync('npx vite build --root ./client --outDir ../dist/public', { stdio: 'inherit', cwd: process.cwd() });
  
  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}