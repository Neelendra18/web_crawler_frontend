# Installation & Setup Guide

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher (or yarn/pnpm)
- **Git**: Latest version
- **Python**: For backend integration (optional for frontend development)

Check your versions:
```bash
node --version   # Should be v18+
npm --version    # Should be v9+
git --version    # Any recent version
```

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd web_crawler_frontend
npm install
```

### 2. Create Environment File

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env if needed (optional - defaults work for local development)
# nano .env   # or use your preferred editor
```

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

---

## Detailed Setup

### Project Initialization (First Time Only)

```bash
# 1. Clone the repository
git clone <repository-url>
cd web_crawler_frontend

# 2. Install dependencies
npm install

# 3. Install Git hooks for pre-commit checks (recommended)
npm run setup:hooks  # if available

# 4. Create environment file
cp .env.example .env
```

### Environment Configuration

Create `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# App Settings
VITE_APP_NAME=Web Crawler Test Generator
VITE_APP_VERSION=1.0.0

# Features (development)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

#### Environment Variables Explanation

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Python backend URL | `http://localhost:8000` |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `30000` |
| `VITE_APP_NAME` | Application name | `Web Crawler Test Generator` |
| `VITE_ENABLE_DEBUG_MODE` | Enable API logging | `false` |

---

## Development Commands

### Starting Development

```bash
# Start dev server with hot module replacement
npm run dev

# Dev server will be available at http://localhost:3000
```

### Code Quality

```bash
# Lint code (find issues)
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Type check without building
npm run type-check
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch    # if available

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Building

```bash
# Build for production
npm run build
# Output will be in dist/ folder

# Preview production build locally
npm run preview
```

---

## Common Setup Issues

### Issue 1: Node Version Too Old

```bash
# Check your Node version
node --version

# If < v18, install NVM (Node Version Manager)
# macOS/Linux:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Then:
nvm install 18
nvm use 18
```

### Issue 2: Permission Denied

```bash
# Try clearing npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Port 3000 Already in Use

The dev server will automatically use the next available port. Or manually specify:

```bash
# Change port in vite.config.ts or run with:
npm run dev -- --port 3001
```

### Issue 4: API Connection Errors

Ensure:
1. Backend is running at the configured `VITE_API_BASE_URL`
2. Backend is configured to accept CORS from `localhost:3000`
3. `.env` file has correct API URL

Test backend connection:
```bash
curl http://localhost:8000/api/crawl/start -X POST
```

### Issue 5: Module Not Found Errors

```bash
# Verify path aliases in tsconfig.json
# Common issue: incorrect @/ imports

# Solution: Check tsconfig.json paths configuration
cat tsconfig.json | grep -A 10 '"paths"'
```

---

## IDE Setup

### Visual Studio Code (Recommended)

**Recommended Extensions:**

1. **ES7+ React/Redux/React-Native snippets**
   - Publisher: dsznajder.es7-react-js-snippets

2. **Prettier - Code formatter**
   - Publisher: esbenp.prettier-vscode

3. **ESLint**
   - Publisher: dbaeumer.vscode-eslint

4. **TypeScript Vue Plugin (Volar)**
   - Publisher: Vue (for better TypeScript support)

5. **Thunder Client** or **REST Client**
   - For testing API endpoints

**.vscode/settings.json** (optional):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Other IDEs

- **WebStorm**: Built-in support for React, TypeScript, and Vite
- **Sublime Text**: Install TypeScript plugin and Prettier
- **Vim/Neovim**: Use LSP configuration for TypeScript support

---

## Git Setup

### Pre-commit Hooks (Optional)

Add husky for automated checks before commits:

```bash
npm install -D husky lint-staged

npx husky install

# Create hook
npx husky add .husky/pre-commit "npm run lint-staged"
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

---

## Docker Setup (Optional)

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV VITE_API_BASE_URL=http://localhost:8000

CMD ["npm", "run", "preview"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: http://backend:8000
    depends_on:
      - backend
      
  backend:
    image: python:3.11
    ports:
      - "8000:8000"
```

---

## Next Steps

1. **Read the Architecture Guide**: [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Review Component Examples**: Check `src/components/` directory
3. **Start Development**: Run `npm run dev`
4. **Create a Feature Branch**: `git checkout -b feature/your-feature`

---

## Troubleshooting

### Terminal/Console Help

```bash
# Clear npm cache
npm cache clean --force

# Reinstall specific package
npm install <package-name>

# Update packages
npm update

# Check for security vulnerabilities
npm audit

# View installed packages
npm list

# View global packages
npm list -g
```

### Git Help

```bash
# Check git status
git status

# View recent commits
git log --oneline -5

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Check git configuration
git config --list
```

---

## Performance Tips

### Development Build Performance

1. **Use Vite's fast refresh** - Already configured
2. **Only import what you need**
   ```tsx
   // ❌ Avoid
   import * as Utils from '@utils'
   
   // ✅ Do
   import { config } from '@utils/config'
   ```

3. **Lazy load routes**
   ```tsx
   const CrawlerPage = lazy(() => import('@pages/CrawlerPage'))
   ```

### Build Optimization

Vite automatically optimizes builds with:
- Code splitting
- Tree shaking
- Minification
- Image optimization

---

## Getting Help

### Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)

### Team Support

For immediate assistance:
1. Check existing GitHub issues
2. Contact the development team
3. Create a new GitHub issue with details

---

## Next Actions

✅ Install Node.js v18+
✅ Clone the repository
✅ Run `npm install`
✅ Copy `.env.example` to `.env`
✅ Run `npm run dev`
✅ Open `http://localhost:3000`

Welcome to the Web Crawler Frontend project! 🚀
