const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Render Definitive Build ===');
console.log('Working directory:', process.cwd());
console.log('Node version:', process.version);

try {
  // Force install all dependencies including dev
  console.log('Installing all dependencies...');
  execSync('npm install --include=dev --legacy-peer-deps --no-audit', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  // Verify vite is available
  console.log('Verifying Vite...');
  try {
    const viteVersion = execSync('npx vite --version', { encoding: 'utf8' });
    console.log('Vite version:', viteVersion.trim());
  } catch (error) {
    console.log('Installing Vite explicitly...');
    execSync('npm install vite@^5.4.15 --save-dev', { stdio: 'inherit' });
  }

  // Clean build directories
  console.log('Preparing build directories...');
  const distDir = path.join(process.cwd(), 'dist');
  const publicDir = path.join(distDir, 'public');
  
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  // Build frontend using vite directly
  console.log('Building frontend...');
  execSync('npx vite build --outDir dist/public --mode production --emptyOutDir', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20', { 
    stdio: 'inherit' 
  });

  // Verify build output
  const frontendFiles = fs.readdirSync(publicDir);
  const backendFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.js'));
  
  console.log('Frontend files:', frontendFiles.length);
  console.log('Backend files:', backendFiles.length);
  
  if (!frontendFiles.includes('index.html')) {
    throw new Error('Frontend build failed - no index.html');
  }
  
  if (backendFiles.length === 0) {
    throw new Error('Backend build failed - no JS files');
  }

  console.log('Build completed successfully!');

} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}