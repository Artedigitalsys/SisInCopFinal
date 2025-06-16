const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Render Deployment Script ===');
console.log('Working directory:', process.cwd());

try {
  // Install all dependencies (including dev dependencies for build)
  console.log('Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });

  // Fix security vulnerabilities
  console.log('Fixing security vulnerabilities...');
  try {
    execSync('npm audit fix --force', { stdio: 'inherit' });
  } catch (auditError) {
    console.log('Audit fix completed with warnings (continuing...)');
  }

  // Ensure build directories exist
  console.log('Creating build directories...');
  const distDir = path.join(process.cwd(), 'dist');
  const publicDir = path.join(distDir, 'public');
  
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  // Verify project structure
  const clientDir = path.join(process.cwd(), 'client');
  const indexHtml = path.join(clientDir, 'index.html');
  
  if (!fs.existsSync(clientDir)) {
    throw new Error('Client directory not found');
  }
  
  if (!fs.existsSync(indexHtml)) {
    throw new Error('client/index.html not found');
  }

  // Build frontend
  console.log('Building frontend...');
  const viteCmd = `npx vite build --root "${clientDir}" --outDir "${publicDir}" --emptyOutDir`;
  execSync(viteCmd, { stdio: 'inherit' });

  // Build backend
  console.log('Building backend...');
  const esbuildCmd = 'npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist';
  execSync(esbuildCmd, { stdio: 'inherit' });

  // Verify build output
  if (!fs.existsSync(path.join(publicDir, 'index.html'))) {
    throw new Error('Frontend build failed - no index.html generated');
  }

  if (!fs.existsSync(path.join(distDir, 'index.js'))) {
    throw new Error('Backend build failed - no index.js generated');
  }

  console.log('✅ Build completed successfully!');
  console.log('Frontend files:', fs.readdirSync(publicDir).slice(0, 5));
  console.log('Backend files:', fs.readdirSync(distDir));

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}