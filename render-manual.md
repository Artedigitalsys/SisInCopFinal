# Manual de Configuração Render

## Problema Identificado
O Render está ignorando o `render.yaml` e executando automaticamente `npm run build` do package.json, que não funciona porque o Vite não está no PATH.

## Soluções para Configurar no Painel Render

### Opção 1 - Build Command Recomendado (Resolve --root não suportado)
```bash
node render-final-solution.cjs
```

### Opção 2 - Script Bash
```bash
chmod +x build.sh && ./build.sh
```

### Opção 3 - Comando Direto Completo
```bash
npm install --include=dev --force && rm -rf dist && mkdir -p dist/public && ./node_modules/.bin/vite build --config vite.config.ts --mode production && ./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20
```

### Opção 4 - Fallback Simples
```bash
npm install --include=dev && npx vite build --config vite.config.ts --mode production && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node20
```

## Start Command
```bash
node dist/index.js
```

## Environment Variables
```
NODE_ENV=production
NODE_VERSION=20.18.1
DATABASE_URL=(sua string PostgreSQL)
```

## Nota Importante
Configure MANUALMENTE no painel do Render - o render.yaml pode estar sendo ignorado.