const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Render Final Build Solution ===');

try {
  // Install dependencies with force to overcome audit issues
  console.log('Installing dependencies...');
  execSync('npm install --include=dev --no-audit --no-fund --force', { 
    stdio: 'inherit' 
  });

  // Clean and create build directories
  console.log('Preparing build directories...');
  const distDir = path.join(process.cwd(), 'dist');
  const publicDir = path.join(distDir, 'public');
  
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(publicDir, { recursive: true });

  // Verify required files exist
  const viteConfig = path.join(process.cwd(), 'vite.config.ts');
  const clientIndex = path.join(process.cwd(), 'client', 'index.html');
  const serverIndex = path.join(process.cwd(), 'server', 'index.ts');
  
  if (!fs.existsSync(viteConfig)) {
    throw new Error('vite.config.ts not found');
  }
  if (!fs.existsSync(clientIndex)) {
    throw new Error('client/index.html not found');
  }
  if (!fs.existsSync(serverIndex)) {
    throw new Error('server/index.ts not found');
  }

  console.log('Project structure verified successfully');

  // Build frontend using vite.config.ts (which has root: "client" configured)
  console.log('Building frontend...');
  const viteBin = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
  
  execSync(`${viteBin} build --mode production`, {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Build backend
  console.log('Building backend...');
  const esbuildBin = path.join(process.cwd(), 'node_modules', '.bin', 'esbuild');
  
  execSync(`${esbuildBin} server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20`, {
    stdio: 'inherit'
  });

  // Verify build output
  console.log('Verifying build output...');
  
  if (!fs.existsSync(path.join(publicDir, 'index.html'))) {
    throw new Error('Frontend build failed - no index.html in dist/public');
  }
  
  if (!fs.existsSync(path.join(distDir, 'index.js'))) {
    throw new Error('Backend build failed - no index.js in dist');
  }

  const frontendFiles = fs.readdirSync(publicDir);
  const backendFiles = fs.readdirSync(distDir);
  
  console.log(`✓ Frontend files: ${frontendFiles.length}`);
  console.log(`✓ Backend files: ${backendFiles.filter(f => f.endsWith('.js')).length}`);
  console.log('✓ Build completed successfully!');

} catch (error) {
  console.error('Build failed:', error.message);
  console.log('Attempting npx fallback...');
  
  try {
    // Fallback using npx
    execSync('npx vite build --mode production', {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20', {
      stdio: 'inherit'
    });
    
    console.log('✓ Fallback build succeeded!');
    
  } catch (fallbackError) {
    console.error('✗ All build attempts failed:', fallbackError.message);
    
    // Show diagnostic information
    console.log('\n=== Diagnostic Information ===');
    console.log('Node version:', process.version);
    console.log('Working directory:', process.cwd());
    console.log('Files in root:', fs.readdirSync('.').filter(f => f.includes('vite') || f.includes('package')));
    
    process.exit(1);
  }
}