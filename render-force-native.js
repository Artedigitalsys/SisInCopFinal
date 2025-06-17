const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Force Native Build (No Docker) ===');

// Explicitly remove any Docker-related files
const dockerFiles = [
  'Dockerfile',
  'Dockerfile.backup', 
  'docker-compose.yml',
  'docker-compose.yaml',
  '.dockerignore'
];

dockerFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Removed ${file}`);
  }
});

try {
  // Force native Node.js build
  console.log('Installing dependencies...');
  execSync('npm install --include=dev --no-audit --no-fund --legacy-peer-deps', { 
    stdio: 'inherit',
    env: { ...process.env, DOCKER_BUILDKIT: '0', COMPOSE_DOCKER_CLI_BUILD: '0' }
  });

  // Create build directories
  console.log('Creating build directories...');
  const distDir = './dist';
  const publicDir = './dist/public';
  
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  // Build frontend
  console.log('Building frontend with Vite...');
  execSync('npx vite build --outDir dist/public --mode production --force', {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Build backend
  console.log('Building backend with esbuild...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20', {
    stdio: 'inherit'
  });

  // Verify build
  const frontendFiles = fs.readdirSync(publicDir);
  const backendFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.js'));
  
  console.log(`Build successful: ${frontendFiles.length} frontend files, ${backendFiles.length} backend files`);
  
  if (!frontendFiles.includes('index.html')) {
    throw new Error('Frontend build verification failed');
  }
  
  console.log('✅ Native build completed successfully!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}