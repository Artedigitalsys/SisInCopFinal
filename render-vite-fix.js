const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Render Vite Fix ===');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install --include=dev --no-audit --no-fund --force', { 
    stdio: 'inherit' 
  });

  // Verify project structure
  console.log('Verifying project structure...');
  const clientDir = path.join(process.cwd(), 'client');
  const indexHtml = path.join(clientDir, 'index.html');
  const viteConfig = path.join(process.cwd(), 'vite.config.ts');
  
  console.log('Client dir exists:', fs.existsSync(clientDir));
  console.log('Index.html exists:', fs.existsSync(indexHtml));
  console.log('Vite config exists:', fs.existsSync(viteConfig));

  // Clean build directory
  const distDir = path.join(process.cwd(), 'dist');
  const publicDir = path.join(distDir, 'public');
  
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(publicDir, { recursive: true });

  // Build frontend with explicit root and config
  console.log('Building frontend...');
  const viteBin = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
  const buildCmd = `${viteBin} build --root client --config ../vite.config.ts --outDir ../dist/public --mode production`;
  
  execSync(buildCmd, {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Build backend
  console.log('Building backend...');
  const esbuildBin = path.join(process.cwd(), 'node_modules', '.bin', 'esbuild');
  const backendCmd = `${esbuildBin} server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20`;
  
  execSync(backendCmd, { stdio: 'inherit' });

  // Verify build output
  const frontendFiles = fs.readdirSync(publicDir);
  const backendFiles = fs.readdirSync(distDir);
  
  console.log(`Frontend files: ${frontendFiles.length}`);
  console.log(`Backend files: ${backendFiles.filter(f => f.endsWith('.js')).length}`);
  
  const hasIndexHtml = frontendFiles.includes('index.html');
  const hasIndexJs = backendFiles.includes('index.js');
  
  if (!hasIndexHtml) {
    throw new Error('Frontend build failed - no index.html generated');
  }
  
  if (!hasIndexJs) {
    throw new Error('Backend build failed - no index.js generated');
  }

  console.log('Build completed successfully!');

} catch (error) {
  console.error('Primary build failed:', error.message);
  console.log('Attempting alternative build approach...');
  
  try {
    // Alternative: Use vite config with explicit client root
    console.log('Using alternative vite build...');
    execSync('npx vite build --root client --outDir ../dist/public --mode production', {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20', {
      stdio: 'inherit'
    });
    
    console.log('Alternative build succeeded!');
    
  } catch (altError) {
    console.error('Alternative build also failed:', altError.message);
    process.exit(1);
  }
}