const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Render Override Build ===');
console.log('Forcing custom build process...');

// Remove any build scripts that might be auto-detected
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('Original build script:', packageJson.scripts.build);

try {
  // Install dependencies with dev packages
  console.log('Installing dependencies...');
  execSync('npm install --include=dev --no-audit --no-fund --force', { 
    stdio: 'inherit' 
  });

  // Verify tools are available
  console.log('Verifying build tools...');
  const vitePath = './node_modules/.bin/vite';
  const esbuildPath = './node_modules/.bin/esbuild';
  
  if (!fs.existsSync(vitePath)) {
    console.log('Installing vite...');
    execSync('npm install vite@latest --save-dev', { stdio: 'inherit' });
  }
  
  if (!fs.existsSync(esbuildPath)) {
    console.log('Installing esbuild...');
    execSync('npm install esbuild@latest --save-dev', { stdio: 'inherit' });
  }

  // Clean build
  console.log('Cleaning build directory...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist/public', { recursive: true });

  // Build frontend with absolute path
  console.log('Building frontend...');
  execSync(`${vitePath} build --outDir dist/public --mode production --emptyOutDir`, {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Build backend with absolute path
  console.log('Building backend...');
  execSync(`${esbuildPath} server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20`, {
    stdio: 'inherit'
  });

  // Verify build success
  const frontendFiles = fs.readdirSync('dist/public');
  const hasIndexHtml = frontendFiles.includes('index.html');
  const hasIndexJs = fs.existsSync('dist/index.js');

  console.log(`Frontend files: ${frontendFiles.length}`);
  console.log(`Has index.html: ${hasIndexHtml}`);
  console.log(`Has index.js: ${hasIndexJs}`);

  if (!hasIndexHtml || !hasIndexJs) {
    throw new Error('Build verification failed');
  }

  console.log('Build completed successfully!');

} catch (error) {
  console.error('Build failed:', error.message);
  console.error('Attempting fallback build...');
  
  try {
    // Fallback: try with npx
    execSync('npx vite build --outDir dist/public --mode production', { stdio: 'inherit' });
    execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20', { stdio: 'inherit' });
    console.log('Fallback build succeeded!');
  } catch (fallbackError) {
    console.error('Fallback build also failed:', fallbackError.message);
    process.exit(1);
  }
}