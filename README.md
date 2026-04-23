# Web Crawler Frontend - React Architecture

A best-practice React TypeScript frontend application for web crawling and automated test case generation. This project supports two input methods: website URL crawling and document upload analysis.

## 🏗️ Architecture Overview

```
web_crawler_frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── StatusIndicator/
│   │   ├── Pipeline/
│   │   ├── Batch/
│   │   ├── LogViewer/
│   │   ├── TestPreview/
│   │   └── index.ts        # Component exports
│   │
│   ├── pages/              # Page components (screens)
│   │   ├── CrawlerPage.tsx
│   │   └── index.ts
│   │
│   ├── services/           # API integration layer
│   │   ├── apiClient.ts    # Axios instance with interceptors
│   │   └── crawlerService.ts # Crawler API methods
│   │
│   ├── store/              # State management (Zustand)
│   │   └── crawlerStore.ts
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── usePolling.ts
│   │   ├── useAsync.ts
│   │   └── index.ts
│   │
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── utils/              # Utility functions
│   │   └── config.ts       # Environment config
│   │
│   ├── styles/             # Global styles
│   │   └── index.css
│   │
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
│
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Test configuration
├── tsconfig.json           # TypeScript configuration
├── .eslintrc.cjs           # ESLint configuration
├── .prettierrc              # Prettier configuration
└── .env.example            # Example environment variables
```

## ✨ Features

### Dual Input Methods
- **🌐 Website URL Crawling**: Crawl and analyze live websites for test case generation
- **📄 Document Upload**: Upload PDF, BRD, DOC, DOCX, TXT, and MD files for analysis
- **🔄 Seamless Switching**: Toggle between input methods with persistent form state

### Advanced Crawling & Analysis
- **🤖 AI-Powered Test Generation**: Automated test case creation from web content or documents
- **🎯 Multi-Framework Support**: Generate tests for Playwright and Selenium
- **💻 Language Options**: TypeScript and Python test output
- **🔐 Authentication Handling**: Support for various auth methods (None, Form Login, SSO/OAuth)

### Real-Time Processing
- **📊 Live Progress Tracking**: Real-time pipeline status and metrics
- **📝 Detailed Logging**: Comprehensive logs with structured error tracking
- **⏸️ Cancellable Operations**: Abort running crawls with proper cleanup
- **📈 Performance Monitoring**: API timing and response metrics

### Developer Experience
- **🏗️ Production-Ready Architecture**: Modular, scalable, and maintainable codebase
- **🧪 Comprehensive Testing**: Unit tests with Vitest and React Testing Library
- **📚 Full TypeScript**: Type-safe development with strict mode
- **🎨 Modern UI**: Clean, responsive interface with dark theme
- **📱 Mobile Friendly**: Responsive design for all screen sizes

## 📋 Key Architecture Decisions

### 1. **State Management: Zustand**
- ✅ Lightweight and performant
- ✅ Minimal boilerplate compared to Redux
- ✅ Perfect for this application's complexity level
- ✅ Easy to test and debug

Two separate stores:
- `useCrawlerStore`: UI form state and crawler configuration
- `useProcessingStore`: Processing progress, logs, and metrics

### 2. **API Integration: Axios + Service Layer**
- ✅ Centralized API client with interceptors
- ✅ Request/response logging in debug mode
- ✅ Type-safe API calls
- ✅ Easy to mock for testing
- ✅ Automatic error handling

### 3. **Component Architecture**
- ✅ Small, focused, reusable components
- ✅ Container/Presentational pattern
- ✅ Proper TypeScript interfaces for all props
- ✅ CSS modules for component styling

### 4. **Build Tool: Vite**
- ✅ Lightning-fast HMR (Hot Module Replacement)
- ✅ Optimized for modern JavaScript
- ✅ Better TypeScript support
- ✅ Smaller bundle sizes

### 5. **Type Safety: TypeScript**
- ✅ Strict mode enabled
- ✅ All API responses typed
- ✅ Component props fully typed
- ✅ Better IDE support and autocomplete

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your API base URL
# VITE_API_BASE_URL=http://localhost:8000
```

### Development

```bash
# Start dev server (http://localhost:3000)
npm run dev

# Run linter
npm run lint
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Testing

```bash
# Run tests
npm run test

# Run tests in UI mode
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 📦 Dependencies

### Core
- **react**: UI framework
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing

### State & Data
- **zustand**: Lightweight state management
- **axios**: HTTP client

### Utilities
- **clsx**: Utility for conditional CSS classes
- **date-fns**: Date formatting utilities

### Development
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **eslint**: Code linting
- **prettier**: Code formatting
- **vitest**: Unit testing framework
- **@testing-library/react**: React testing utilities

## 🔄 Data Flow

```
User Input (CrawlerPage)
    ↓
Zustand Store (useCrawlerStore)
    ↓
API Service (crawlerService)
    ↓
Axios Client with Interceptors
    ↓
Python Backend
    ↓
Response Processing
    ↓
Processing Store (useProcessingStore)
    ↓
UI Components Re-render
```

## 🛠️ Backend Integration

The frontend communicates with a Python backend via REST API. Expected endpoints:

```
POST   /api/crawl/start              - Start a new crawl job
GET    /api/crawl/{jobId}/status     - Get job status
POST   /api/crawl/{jobId}/cancel     - Cancel a job
GET    /api/crawl/{jobId}/download   - Download test files
POST   /api/crawl/{jobId}/push-git   - Push to Git
GET    /api/crawl/history            - Get crawl history
```

All requests should return proper HTTP status codes and error messages.

## 🎨 Component Library

### Base Components

#### `<Input />`
```tsx
<Input
  label="Website URL"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  error={error}
  placeholder="https://example.com"
  disabled={isLoading}
/>
```

#### `<Select />`
```tsx
<Select
  label="Framework"
  options={[
    { label: 'Playwright', value: 'Playwright' },
    { label: 'Selenium', value: 'Selenium' }
  ]}
  value={framework}
  onChange={(e) => setFramework(e.target.value)}
/>
```

#### `<Button />`
```tsx
<Button
  variant="primary" // primary | secondary | danger
  isLoading={false}
  onClick={handleClick}
>
  Click Me
</Button>
```

#### `<StatusIndicator />`
```tsx
<StatusIndicator
  status="running" // idle | running | completed | failed
  label="Processing..."
/>
```

### Complex Components

#### `<Pipeline />`
Displays 5-step processing pipeline with visual progress.

#### `<Batches />`
Shows parallel batch processing with progress bars.

#### `<LogViewer />`
Scrollable log viewer with severity levels (info, warning, error, success).

#### `<TestPreview />`
Displays generated test cases with code snippets.

## 🎯 Best Practices Implemented

### ✅ Code Organization
- Clear separation of concerns
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)

### ✅ Performance
- Code splitting ready
- Lazy loading support via React Router
- Optimized re-renders with Zustand
- Efficient API polling strategy

### ✅ Error Handling
- Try-catch blocks in async operations
- Error logging to UI
- User-friendly error messages
- Graceful degradation

### ✅ Type Safety
- Strict TypeScript
- No `any` types (except unavoidable)
- Proper interface definitions
- Type inference where appropriate

### ✅ Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Good contrast ratios

### ✅ Testing
- Unit test infrastructure ready
- Component testing utilities
- API mocking capabilities
- Integration test support

### ✅ Development Experience
- Hot Module Replacement (HMR)
- Fast refresh
- Source maps for debugging
- ESLint + Prettier integration
- Debug mode support

## 🔐 Environment Configuration

```env
# .env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Web Crawler Test Generator
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

Access in code:
```tsx
import { config } from '@utils/config'

const apiUrl = config.apiBaseUrl
const debugMode = config.enableDebugMode
```

## 📁 File Naming Conventions

- **Components**: PascalCase (e.g., `CrawlerPage.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePolling.ts`)
- **Types**: PascalCase (e.g., `CrawlerState`)
- **Utils**: camelCase (e.g., `config.ts`)
- **Styles**: Matches component name (e.g., `Button.css`)

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- User interactions
- Hook behavior

### Integration Tests
- API communication flow
- Store state updates
- Component integration

### E2E Tests (Future)
- Full user workflows
- Cross-browser testing
- Performance testing

## 📊 Performance Tips

1. **Bundle Size**
   ```bash
   npm run build  # Check dist size
   ```

2. **Lazy Loading**
   ```tsx
   const CrawlerPage = lazy(() => import('@pages/CrawlerPage'))
   ```

3. **Memoization**
   ```tsx
   const MemoComponent = memo(MyComponent)
   ```

## 🚨 Common Issues & Solutions

### Issue: API calls failing
- Check CORS configuration on backend
- Verify `VITE_API_BASE_URL` in `.env`
- Check network tab in DevTools

### Issue: State not updating
- Verify Zustand store is properly initialized
- Check if component is subscribed to store
- Review selector function

### Issue: Styling not appearing
- Clear browser cache
- Check CSS file imports
- Verify CSS class names match

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Documentation](https://vitejs.dev)
- [Axios Documentation](https://axios-http.com)

## 📝 License

Proprietary - Internal Use Only

## 🤝 Contributing

1. Follow the code style (enforced by ESLint + Prettier)
2. Add tests for new features
3. Update documentation
4. Create meaningful commit messages

## 📞 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

**Last Updated**: 2024
**Version**: 1.0.0

The UI visualizes the entire pipeline, batch processing, generated test previews, and real-time execution logs.

Key Highlights:
- Modular and feature-based React architecture
- State management using Redux Toolkit
- Config-driven pipeline visualization
- Reusable UI components
- Scalable structure for production-grade applications
