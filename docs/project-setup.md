# AI-Powered Support Ticket Triage Dashboard - Project Setup

## Overview

This document provides the complete project structure, initialization commands, and configuration files needed to set up the ticket triage application for **User Story 1: Customer Submitting a Ticket**.

---

## Project Structure

### Folder Tree

```
ai-ticket-triage/
├── backend/                          # Express.js API Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection config
│   │   │   └── env.js               # Environment variable validation
│   │   ├── controllers/
│   │   │   └── ticketController.js  # Ticket CRUD operations
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   ├── rateLimiter.js       # Rate limiting middleware
│   │   │   └── validator.js         # Request validation middleware
│   │   ├── models/
│   │   │   └── Ticket.js            # Mongoose ticket schema
│   │   ├── routes/
│   │   │   └── ticketRoutes.js      # Ticket API routes
│   │   ├── services/
│   │   │   ├── ticketService.js     # Ticket business logic
│   │   │   └── aiService.js         # OpenAI API integration
│   │   ├── utils/
│   │   │   ├── logger.js            # Winston logger setup
│   │   │   └── constants.js         # Application constants
│   │   └── app.js                   # Express app setup
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── services/
│   │   │   └── controllers/
│   │   ├── integration/
│   │   │   └── tickets.test.js      # API integration tests
│   │   └── fixtures/
│   │       └── ticketData.js        # Test data fixtures
│   ├── .env.example                 # Environment variables template
│   ├── .env                         # Environment variables (gitignored)
│   ├── .gitignore
│   ├── jest.config.js               # Jest test configuration
│   ├── package.json
│   └── server.js                    # Server entry point
│
├── frontend/                         # React Application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── TicketForm/
│   │   │   │   ├── TicketForm.jsx
│   │   │   │   ├── TicketForm.test.jsx
│   │   │   │   └── index.js
│   │   │   ├── UI/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Textarea.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── Alert.jsx
│   │   │   └── Layout/
│   │   │       ├── Header.jsx
│   │   │       └── Container.jsx
│   │   ├── pages/
│   │   │   └── SubmitTicket.jsx     # Ticket submission page
│   │   ├── services/
│   │   │   └── api.js               # API client (Axios)
│   │   ├── hooks/
│   │   │   ├── useTicketForm.js     # Form state management
│   │   │   └── useApi.js            # API call hook
│   │   ├── context/
│   │   │   └── TicketContext.jsx    # Global ticket state (future)
│   │   ├── utils/
│   │   │   ├── validation.js        # Form validation helpers
│   │   │   └── constants.js         # Frontend constants
│   │   ├── App.jsx
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles + Tailwind
│   ├── tests/
│   │   └── setup.js                 # Vitest setup
│   ├── .env.example
│   ├── .env                         # Frontend environment variables
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   └── vitest.config.js             # Vitest configuration
│
├── docs/                             # Project documentation
│   ├── vision.md
│   ├── user-stories.md
│   ├── requirements.md
│   ├── architecture.md
│   ├── stack-decisions.md
│   ├── domain-model.md
│   ├── api-contracts.md
│   └── project-setup.md
│
├── .gitignore                        # Root gitignore
├── README.md                         # Project README
└── package.json                      # Root package.json (optional monorepo)
```

---

## Initialization Commands

### Prerequisites

- Node.js 22+ LTS installed
- MongoDB installed and running (or MongoDB Atlas account)
- npm or yarn package manager

### Step 1: Create Project Root

```bash
# Create project directory
mkdir ai-ticket-triage
cd ai-ticket-triage

# Initialize git repository
git init
```

### Step 2: Set Up Backend

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize npm project
npm init -y

# Install production dependencies
npm install express mongoose dotenv helmet cors morgan express-rate-limit express-validator winston openai axios

# Install development dependencies
npm install --save-dev nodemon jest supertest @types/jest eslint prettier eslint-config-prettier eslint-plugin-node

# Create directory structure
mkdir -p src/{config,controllers,middleware,models,routes,services,utils}
mkdir -p tests/{unit/{services,controllers},integration,fixtures}

# Initialize Git in backend
git init
```

### Step 3: Set Up Frontend

```bash
# Return to root, create frontend directory
cd ..
mkdir frontend
cd frontend

# Create React app with Vite
npm create vite@latest . -- --template react

# Install additional dependencies
npm install axios react-hook-form @headlessui/react @heroicons/react

# Install development dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Create directory structure
mkdir -p src/{components/{TicketForm,UI,Layout},pages,services,hooks,context,utils}
mkdir -p tests

# Initialize Git in frontend
git init
```

### Step 4: Install Root Dependencies (Optional - for monorepo scripts)

```bash
cd ..
npm init -y
```

---

## Configuration Files

### Backend Configuration

#### `backend/package.json`

```json
{
  "name": "ticket-triage-backend",
  "version": "1.0.0",
  "description": "Backend API for AI-Powered Ticket Triage Dashboard",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src tests",
    "lint:fix": "eslint src tests --fix",
    "format": "prettier --write \"src/**/*.js\" \"tests/**/*.js\""
  },
  "keywords": ["express", "mongodb", "openai", "tickets"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "winston": "^3.11.0",
    "openai": "^4.20.1",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "@types/jest": "^29.5.8",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-node": "^11.1.0"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ],
    "testMatch": [
      "**/tests/**/*.test.js"
    ]
  }
}
```

#### `backend/.env.example`

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ticket-triage
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ticket-triage

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# Logging
LOG_LEVEL=info
```

#### `backend/.env`

```env
# Copy from .env.example and fill in your values
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ticket-triage
OPENAI_API_KEY=sk-your-actual-api-key
OPENAI_MODEL=gpt-3.5-turbo
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
LOG_LEVEL=info
```

#### `backend/.gitignore`

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/
```

#### `backend/jest.config.js`

```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true
};
```

#### `backend/.eslintrc.js`

```javascript
export default {
  env: {
    node: true,
    es2022: true,
    jest: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: ['node'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

#### `backend/.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

#### `backend/server.js`

```javascript
import app from './src/app.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
```

---

### Frontend Configuration

#### `frontend/package.json`

```json
{
  "name": "ticket-triage-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext js,jsx",
    "lint:fix": "eslint src --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "react-hook-form": "^7.49.2",
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.1.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "vitest": "^1.0.4",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "prettier": "^3.1.0",
    "eslint-config-prettier": "^9.1.0",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

#### `frontend/.env.example`

```env
VITE_API_URL=http://localhost:3000/api
```

#### `frontend/.env`

```env
VITE_API_URL=http://localhost:3000/api
```

#### `frontend/.gitignore`

```
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment variables
.env
.env.local
.env.*.local

# Build output
dist/
dist-ssr/
*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
```

#### `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js'
  }
});
```

#### `frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Priority colors
        priority: {
          critical: '#dc2626', // red-600
          high: '#ea580c',     // orange-600
          medium: '#eab308',   // yellow-600
          low: '#16a34a',      // green-600
        }
      }
    },
  },
  plugins: [],
};
```

#### `frontend/postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### `frontend/vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

#### `frontend/.eslintrc.cjs`

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'react/prop-types': 'off',
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
```

#### `frontend/.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

#### `frontend/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors;
  }
  
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }
}
```

#### `frontend/tests/setup.js`

```javascript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

---

### Root Configuration

#### Root `.gitignore`

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/
coverage/
```

#### Root `README.md`

```markdown
# AI-Powered Support Ticket Triage Dashboard

Full-stack application for automated ticket categorization, prioritization, and summarization.

## Tech Stack

- **Backend:** Node.js 22+, Express.js, MongoDB, Mongoose
- **Frontend:** React 18+, Vite, Tailwind CSS
- **AI:** OpenAI API

## Quick Start

### Backend Setup

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key
npm run dev
\`\`\`

### Frontend Setup

\`\`\`bash
cd frontend
npm install
cp .env.example .env
npm run dev
\`\`\`

## Project Structure

- \`backend/\` - Express.js API server
- \`frontend/\` - React application
- \`docs/\` - Project documentation

See \`docs/project-setup.md\` for detailed setup instructions.
```

---

## Next Steps

1. **Set up MongoDB:**
   - Install MongoDB locally, or
   - Create MongoDB Atlas account and get connection string

2. **Get OpenAI API Key:**
   - Sign up at https://platform.openai.com/
   - Create an API key
   - Add to `backend/.env`

3. **Run Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run dev
   ```

4. **Run Frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

5. **Start Development:**
   - Backend runs on http://localhost:3000
   - Frontend runs on http://localhost:5173
   - Begin implementing User Story 1 components

---

