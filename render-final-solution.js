const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Render Final Solution ===');

try {
  // Clean install with dev dependencies
  console.log('Installing all dependencies...');
  execSync('npm install --include=dev --no-audit --no-fund --force', { 
    stdio: 'inherit'
  });

  // Create clean build directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist/public', { recursive: true });

  // Build frontend using global vite path
  console.log('Building frontend...');
  execSync('./node_modules/.bin/vite build --outDir dist/public --mode production', {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Build backend
  console.log('Building backend...');
  execSync('./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20', {
    stdio: 'inherit'
  });

  // Verify build
  const frontendFiles = fs.readdirSync('dist/public');
  const backendFiles = fs.readdirSync('dist');
  
  console.log(`Frontend: ${frontendFiles.length} files`);
  console.log(`Backend: ${backendFiles.filter(f => f.endsWith('.js')).length} JS files`);
  
  if (!frontendFiles.includes('index.html')) {
    throw new Error('Frontend build failed - no index.html');
  }
  
  if (!backendFiles.includes('index.js')) {
    throw new Error('Backend build failed - no index.js');
  }

  console.log('Build completed successfully!');

} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}