const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Render Production Build ===');
console.log('Working directory:', process.cwd());
console.log('Node version:', process.version);

// List all files to debug directory structure
console.log('Root directory contents:');
const rootFiles = fs.readdirSync(process.cwd());
rootFiles.forEach(file => {
  const stat = fs.statSync(file);
  console.log(`  ${stat.isDirectory() ? 'DIR' : 'FILE'}: ${file}`);
});

try {
  // Install dependencies without audit warnings
  console.log('\n📦 Installing dependencies...');
  execSync('npm ci --include=dev --no-audit --no-fund', { stdio: 'inherit' });

  // Create clean build directories
  console.log('\n🗂️ Creating build directories...');
  const distDir = path.join(process.cwd(), 'dist');
  const publicDir = path.join(distDir, 'public');
  
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  // Verify critical files exist
  const criticalFiles = [
    'package.json',
    'vite.config.ts',
    'server/index.ts',
    'client/index.html'
  ];

  console.log('\n🔍 Verifying project structure...');
  criticalFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists && file === 'client/index.html') {
      throw new Error(`Critical file missing: ${file}`);
    }
  });

  // Build frontend using vite directly without cd
  console.log('\n🎨 Building frontend...');
  const buildCmd = 'npx vite build --config vite.config.ts --outDir dist/public --mode production';
  execSync(buildCmd, { stdio: 'inherit', cwd: process.cwd() });

  // Build backend
  console.log('\n⚙️ Building backend...');
  const serverCmd = 'npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20';
  execSync(serverCmd, { stdio: 'inherit' });

  // Verify build results
  console.log('\n✅ Verifying build output...');
  const distContents = fs.readdirSync(distDir);
  const publicContents = fs.readdirSync(publicDir);
  
  console.log('Dist directory:', distContents);
  console.log('Public directory:', publicContents.slice(0, 10)); // First 10 files
  
  // Check for essential files
  const hasIndexHtml = fs.existsSync(path.join(publicDir, 'index.html'));
  const hasServerJs = fs.existsSync(path.join(distDir, 'index.js'));
  
  if (!hasIndexHtml) throw new Error('Frontend build failed - missing index.html');
  if (!hasServerJs) throw new Error('Backend build failed - missing index.js');

  console.log('\n🎉 Build completed successfully!');
  console.log(`✅ Frontend: ${publicContents.length} files built`);
  console.log(`✅ Backend: ${distContents.filter(f => f.endsWith('.js')).length} JS files built`);

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}