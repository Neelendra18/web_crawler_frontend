# React Frontend Architecture Guide

## Overview

This document provides detailed guidance on the architecture, patterns, and best practices used in the Web Crawler Frontend application.

## Table of Contents

1. [Project Structure](#project-structure)
2. [State Management](#state-management)
3. [API Integration](#api-integration)
4. [Component Patterns](#component-patterns)
5. [Type Safety](#type-safety)
6. [Performance Optimization](#performance-optimization)
7. [Error Handling](#error-handling)
8. [Testing Strategy](#testing-strategy)

---

## Project Structure

### Directory Hierarchy

```
src/
├── components/         # Reusable UI components
├── pages/             # Full-page components (routes)
├── services/          # API calls and external integrations
├── store/             # Global state management
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and helpers
└── styles/            # Global styles
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `CrawlerPage.tsx`, `Button.tsx` |
| Hooks | camelCase + `use` prefix | `usePolling.ts`, `useAsync.ts` |
| Types/Interfaces | PascalCase | `CrawlerState`, `AuthConfig` |
| Utilities | camelCase | `config.ts`, `helpers.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_TIMEOUT` |
| CSS Classes | kebab-case | `status-indicator`, `button-primary` |

### Module Organization

Each component follows this structure:

```
components/
└── Button/
    ├── Button.tsx       # Component logic
    ├── Button.css       # Component styles
    ├── Button.test.tsx  # Component tests
    └── index.ts         # Component export
```

---

## State Management

### Architecture: Zustand Stores

We use Zustand for lightweight, efficient state management.

#### Why Zustand?

- Minimal boilerplate
- No provider wrapping needed (but can add if needed)
- Excellent TypeScript support
- Easy debugging
- Fast performance
- Small bundle size
- Easier to test than Context API

#### Store Structure

```tsx
// store/crawlerStore.ts
import { create } from 'zustand'

interface CrawlerStore {
  // State
  websiteUrl: string
  isRunning: boolean
  
  // Actions
  setWebsiteUrl: (url: string) => void
  setIsRunning: (running: boolean) => void
}

export const useCrawlerStore = create<CrawlerStore>(set => ({
  // Initial state
  websiteUrl: 'https://example.com',
  isRunning: false,
  
  // Actions
  setWebsiteUrl: (url: string) => set({ websiteUrl: url }),
  setIsRunning: (running: boolean) => set({ isRunning: running }),
}))
```

#### Usage in Components

```tsx
import { useCrawlerStore } from '@store/crawlerStore'

export const MyComponent: React.FC = () => {
  // Subscribe to store
  const websiteUrl = useCrawlerStore(state => state.websiteUrl)
  const setWebsiteUrl = useCrawlerStore(state => state.setWebsiteUrl)
  
  // Or destructure multiple at once
  const { websiteUrl, setWebsiteUrl } = useCrawlerStore()
  
  return (
    <input 
      value={websiteUrl}
      onChange={(e) => setWebsiteUrl(e.target.value)}
    />
  )
}
```

#### Best Practices

✅ **DO:**
- Create separate stores for different concerns
- Use descriptive action names
- Keep state as flat as possible
- Memoize selectors in performance-critical code

❌ **DON'T:**
- Overuse Zustand for component-level state
- Create deeply nested store objects
- Update store directly outside of actions
- Mix business logic with UI state

---

## API Integration

### Architecture: Service Layer Pattern

We use a service layer to abstract API calls from components.

#### API Client

```tsx
// services/apiClient.ts
import axios, { AxiosInstance } from 'axios'
import { config } from '@utils/config'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: config.apiTimeout,
    })

    // Request interceptor
    this.client.interceptors.request.use(req => {
      // Log requests in debug mode
      if (config.enableDebugMode) {
        console.log('API Request:', req.method, req.url)
      }
      return req
    })

    // Response interceptor
    this.client.interceptors.response.use(
      res => res,
      error => {
        // Centralized error handling
        console.error('API Error:', error.response?.status)
        return Promise.reject(error)
      }
    )
  }

  public getClient() {
    return this.client
  }
}

export const apiClient = new ApiClient().getClient()
```

#### Service Methods

```tsx
// services/crawlerService.ts
import { apiClient } from './apiClient'
import { CrawlRequest, CrawlResponse } from '@types/index'

export const crawlerService = {
  async startCrawl(request: CrawlRequest): Promise<CrawlResponse> {
    const response = await apiClient.post<CrawlResponse>('/api/crawl/start', request)
    return response.data
  },

  async getCrawlStatus(jobId: string): Promise<CrawlResponse> {
    const response = await apiClient.get<CrawlResponse>(`/api/crawl/${jobId}/status`)
    return response.data
  },
}
```

#### Usage in Components

```tsx
import { crawlerService } from '@services/crawlerService'

export const CrawlerPage: React.FC = () => {
  const handleStart = async () => {
    try {
      const response = await crawlerService.startCrawl({
        website_url: 'https://example.com',
        auth_type: 'None (Public)',
        framework: 'Playwright',
        language: 'TypeScript',
      })
      // Handle response
    } catch (error) {
      // Handle error
    }
  }

  return <button onClick={handleStart}>Start Crawl</button>
}
```

#### Benefits

✅ **Separation of Concerns** - Components don't know about API details
✅ **Testability** - Easy to mock services in tests
✅ **Reusability** - Services can be shared across components
✅ **Centralized Error Handling** - Consistent error management
✅ **Type Safety** - Full TypeScript support
✅ **Caching** - Can add caching logic in service layer
✅ **Retry Logic** - Can add automatic retries

---

## Component Patterns

### 1. Presentational Components

Dumb, reusable components that only render UI.

```tsx
// components/Button/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading, children, ...props }, ref) => {
    return (
      <button ref={ref} className={`button button-${variant}`} {...props}>
        {isLoading && <span className="spinner" />}
        {children}
      </button>
    )
  }
)
```

**Characteristics:**
- No business logic
- Receive all data via props
- Reusable across the app
- Easy to test
- Can be used in Storybook

### 2. Container Components

Smart components that handle logic and data fetching.

```tsx
// pages/CrawlerPage.tsx
export const CrawlerPage: React.FC = () => {
  const crawlerState = useCrawlerStore()
  const processingState = useProcessingStore()
  
  const handleStart = async () => {
    try {
      const response = await crawlerService.startCrawl(...)
      processingState.addLog({ message: 'Started', level: 'success' })
    } catch (error) {
      processingState.addLog({ message: 'Error', level: 'error' })
    }
  }

  return (
    <div>
      <Input 
        value={crawlerState.websiteUrl}
        onChange={(e) => crawlerState.setWebsiteUrl(e.target.value)}
      />
      <Button onClick={handleStart}>Start</Button>
    </div>
  )
}
```

**Characteristics:**
- Contains business logic
- Connected to state management
- Manages component lifecycle
- Handles data fetching
- Composes presentational components

### 3. Compound Components

Components that share state using React.createContext.

```tsx
// components/Form/Form.tsx
interface FormContextType {
  values: Record<string, unknown>
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FormContext = React.createContext<FormContextType>(null)

export const Form: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [values, setValues] = React.useState({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <FormContext.Provider value={{ values, handleChange }}>
      {children}
    </FormContext.Provider>
  )
}

export const FormField: React.FC<{ name: string }> = ({ name }) => {
  const { values, handleChange } = React.useContext(FormContext)
  return <input name={name} value={values[name]} onChange={handleChange} />
}
```

---

## Type Safety

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,           // Enable all strict checks
    "noUnusedLocals": true,   // Report unused local variables
    "noUnusedParameters": true, // Report unused parameters
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
  }
}
```

### Type Definition Patterns

#### API Types

```tsx
// types/index.ts
export interface CrawlRequest {
  website_url: string
  auth_type: AuthType
  framework: 'Playwright' | 'Selenium'
  language: 'TypeScript' | 'Python'
}

export interface CrawlResponse {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  pages_crawled: number
  test_cases: number
}
```

#### Component Props Types

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  isLoading?: boolean
}
```

#### State Types

```tsx
interface CrawlerState {
  websiteUrl: string
  authType: AuthType
  isRunning: boolean
  error: string | null
}
```

### Discriminated Unions

```tsx
// Good for type-safe data handling
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

// Usage enforces status-specific properties
if (state.status === 'success') {
  console.log(state.data) // ✅ data is available
}
```

---

## Performance Optimization

### 1. Memoization

```tsx
// Memoize components to prevent unnecessary re-renders
const Button = React.memo((props: ButtonProps) => {
  return <button {...props} />
})

// Memoize callbacks
const handleClick = React.useCallback(() => {
  doSomething()
}, [dependency])
```

### 2. Code Splitting

```tsx
// pages/index.ts
export const CrawlerPage = lazy(() => import('./CrawlerPage'))

// App.tsx
<Suspense fallback={<Spinner />}>
  <CrawlerPage />
</Suspense>
```

### 3. Virtual Scrolling (for large lists)

```tsx
import { FixedSizeList } from 'react-window'

export const LargeLogList = ({ logs }: { logs: LogEntry[] }) => (
  <FixedSizeList
    height={600}
    itemCount={logs.length}
    itemSize={80}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        {/* Render log item */}
      </div>
    )}
  </FixedSizeList>
)
```

### 4. Zustand Selectors

```tsx
// ❌ Bad: Re-renders on any store change
const state = useStore()

// ✅ Good: Re-renders only when selected value changes
const websiteUrl = useStore(state => state.websiteUrl)
```

---

## Error Handling

### Strategy

```tsx
export const handleApiCall = async () => {
  try {
    const response = await crawlerService.startCrawl(request)
    return response
  } catch (error) {
    if (error instanceof AxiosError) {
      // API error
      const message = error.response?.data?.message || 'API error'
      handleError(message)
    } else if (error instanceof Error) {
      // Standard error
      handleError(error.message)
    } else {
      // Unknown error
      handleError('An unexpected error occurred')
    }
  }
}
```

### Error UI Feedback

```tsx
export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = React.useState<Error | null>(null)

  if (error) {
    return (
      <div className="error-screen">
        <h2>Oops! Something went wrong</h2>
        <p>{error.message}</p>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    )
  }

  return children
}
```

---

## Testing Strategy

### Unit Tests

```tsx
// components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click event', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Integration Tests

```tsx
// pages/CrawlerPage.test.tsx
describe('CrawlerPage', () => {
  it('submits crawl request', async () => {
    vi.mocked(crawlerService.startCrawl).mockResolvedValue({
      id: 'job-1',
      status: 'running',
    })

    render(<CrawlerPage />)
    
    await userEvent.type(screen.getByDisplayValue('https://example.com'), '.com')
    await userEvent.click(screen.getByText('Generate Test Cases'))
    
    expect(crawlerService.startCrawl).toHaveBeenCalled()
  })
})
```

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Lint code
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Building

```bash
# Production build with optimizations
npm run build

# Preview production build
npm run preview
```

---

## Conclusion

This architecture provides:

✅ **Scalability** - Easy to add new features
✅ **Maintainability** - Clear structure and patterns
✅ **Type Safety** - Comprehensive TypeScript coverage
✅ **Testability** - Decoupled, mockable components
✅ **Performance** - Optimized re-renders and bundles
✅ **Developer Experience** - Fast HMR, tooling support

For questions or updates to this guide, please contact the development team.
