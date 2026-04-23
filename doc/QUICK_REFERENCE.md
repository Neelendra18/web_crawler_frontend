# Developer Quick Reference

A quick guide for common tasks while developing the Web Crawler Frontend.

## 🚀 Quick Commands

```bash
# Start development
npm run dev                  # Start with HMR

# Code quality
npm run lint                # Check code
npm run lint:fix           # Fix issues
npm run format             # Format code

# Build & test
npm run build              # Production build
npm run preview            # Preview build
npm run test               # Run tests
```

## 📁 Creating New Components

### Component Template

```bash
# Create component directory
mkdir src/components/MyComponent

# Create files
touch src/components/MyComponent/MyComponent.tsx
touch src/components/MyComponent/MyComponent.css
```

**MyComponent.tsx**:
```tsx
import React from 'react'
import './MyComponent.css'

interface MyComponentProps {
  title: string
  onClick?: () => void
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {onClick && <button onClick={onClick}>Click me</button>}
    </div>
  )
}
```

**MyComponent.css**:
```css
.my-component {
  padding: 16px;
  border-radius: 8px;
  background: var(--panel);
  border: 1px solid var(--border);
}

.my-component h2 {
  margin: 0 0 12px;
  color: var(--text);
}
```

**src/components/index.ts** (update):
```tsx
export { MyComponent } from './MyComponent/MyComponent'
```

## 📦 Using Components

```tsx
import { Button, Input, Select } from '@components'

export const MyPage = () => {
  return (
    <>
      <Input label="Name" placeholder="Enter name" />
      <Select 
        label="Option"
        options={[
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' }
        ]}
      />
      <Button variant="primary">Submit</Button>
    </>
  )
}
```

## 🔌 API Integration

### Adding a New API Endpoint

**1. Add to Service** (`src/services/crawlerService.ts`):
```tsx
export const crawlerService = {
  // ... existing methods

  async getResults(jobId: string) {
    const response = await apiClient.get(`/api/crawl/${jobId}/results`)
    return response.data
  },
}
```

**2. Use in Component**:
```tsx
import { crawlerService } from '@services/crawlerService'

export const ResultsSection = ({ jobId }: { jobId: string }) => {
  const [results, setResults] = React.useState(null)

  React.useEffect(() => {
    crawlerService.getResults(jobId)
      .then(data => setResults(data))
      .catch(error => console.error(error))
  }, [jobId])

  return <div>{results && <pre>{JSON.stringify(results, null, 2)}</pre>}</div>
}
```

## 💾 State Management

### Adding to Zustand Store

**In `src/store/crawlerStore.ts`**:

```tsx
interface CrawlerStore {
  // ... existing
  results: unknown | null
  setResults: (results: unknown) => void
}

export const useCrawlerStore = create<CrawlerStore>(set => ({
  // ... existing state
  results: null,
  setResults: (results: unknown) => set({ results }),
}))
```

### Using Store in Component

```tsx
import { useCrawlerStore } from '@store/crawlerStore'

export const MyComponent = () => {
  const results = useCrawlerStore(state => state.results)
  const setResults = useCrawlerStore(state => state.setResults)

  return <div onClick={() => setResults(newData)}>Click</div>
}
```

## 🎨 Styling

### CSS Variables (Available)

```css
--bg: #0b1220              /* Main background */
--panel: #101a2e           /* Panel background */
--border: rgba(..., 0.1)   /* Border color */
--text: #eaeef7            /* Text color */
--muted: #9aa4c7           /* Muted text */
--accent: #66d9ff          /* Accent color */
--success: #32d583         /* Success color */
--warn: #fdb022            /* Warning color */
```

### Using Variables

```css
.my-element {
  color: var(--text);
  background: var(--panel);
  border: 1px solid var(--border);
}

.my-element:hover {
  color: var(--accent);
}
```

## 🧪 Testing

### Component Test Template

```tsx
// components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'
import { describe, it, expect, vi } from 'vitest'

describe('Button', () => {
  it('renders button', () => {
    render(<Button>Click</Button>)
    expect(screen.getByText('Click')).toBeInTheDocument()
  })

  it('handles click', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(onClick).toHaveBeenCalled()
  })
})
```

## 🐛 Debugging

### Enable Debug Mode

Set in `.env`:
```env
VITE_ENABLE_DEBUG_MODE=true
```

Then check browser console for API logs.

### Zustand DevTools

```tsx
import { devtools } from 'zustand/middleware'

export const useCrawlerStore = create<CrawlerStore>(
  devtools(set => ({
    // ... store definition
  }))
)
```

### TypeScript Errors

```bash
npm run type-check     # Check all TypeScript errors
```

## 📝 Type Definitions

### Common Patterns

```tsx
// Interface for props
interface MyProps {
  required: string
  optional?: number
}

// Type for state
type Status = 'idle' | 'loading' | 'success' | 'error'

// Union types for discriminated unions
type Result = 
  | { status: 'success'; data: unknown }
  | { status: 'error'; error: Error }

// Generic types
interface ApiResponse<T> {
  data: T
  status: number
}
```

## 🔄 Common Tasks

### Fetch Data on Component Mount

```tsx
React.useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await someService.getData()
      setState(response)
    } catch (error) {
      setError(error.message)
    }
  }

  fetchData()
}, [])  // Empty dependency array = run once on mount
```

### Form Handling

```tsx
import { useForm } from '@hooks'

export const MyForm = () => {
  const form = useForm({ name: '', email: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form.values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.values.name as string}
        onChange={form.handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Polling Data

```tsx
import { usePolling } from '@hooks'

export const StatusDisplay = ({ jobId }: { jobId: string }) => {
  const [status, setStatus] = React.useState(null)

  usePolling(
    async () => {
      const data = await crawlerService.getCrawlStatus(jobId)
      setStatus(data)
    },
    1000,  // Interval in ms
    true   // Enabled
  )

  return <div>{status?.status}</div>
}
```

## 📦 Environment Variables

### Add New Variable

1. Add to `.env.example`:
```env
VITE_MY_VAR=default_value
```

2. Access in code (`src/utils/config.ts`):
```tsx
export const config = {
  myVar: import.meta.env.VITE_MY_VAR || 'default',
}
```

3. Use in components:
```tsx
import { config } from '@utils/config'

export const MyComponent = () => {
  return <div>{config.myVar}</div>
}
```

## 🎯 Import Paths

Use aliases for cleaner imports:

```tsx
// ✅ Good
import { Button } from '@components'
import { crawlerService } from '@services/crawlerService'
import { useCrawlerStore } from '@store/crawlerStore'
import { config } from '@utils/config'
import type { CrawlRequest } from '@types/index'

// ❌ Avoid
import { Button } from '../../../components/Button/Button'
import { crawlerService } from '../../../services/crawlerService'
```

## 🔗 Common Patterns

### Conditional Rendering

```tsx
{condition && <Component />}
{condition ? <A /> : <B />}
{items.map(item => <Item key={item.id} item={item} />)}
```

### Conditional CSS

```tsx
import clsx from 'clsx'

<div className={clsx('button', {
  'button-primary': variant === 'primary',
  'button-loading': isLoading,
})}>
```

### Optional Chaining

```tsx
// Safe property access
const value = data?.nested?.property
const result = func?.(arg)
```

## 📚 File Organization

### Folder Structure Pattern

```
Feature/
├── Feature.tsx          # Main component
├── Feature.css          # Styles
├── Feature.test.tsx     # Tests
├── useFeatureHook.ts    # Custom hook (if needed)
└── Feature.types.ts     # Local types (if needed)
```

## 🚀 Performance Tips

### Code Splitting

```tsx
// Load component only when needed
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

<React.Suspense fallback={<Spinner />}>
  <HeavyComponent />
</React.Suspense>
```

### Memoization

```tsx
// Prevent unnecessary re-renders
export const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})
```

## 🎓 Learn More

- [React Docs](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Zustand](https://github.com/pmndrs/zustand)
- Architecture Guide: [ARCHITECTURE.md](./ARCHITECTURE.md)

## 💬 Common Issues

| Issue | Solution |
|-------|----------|
| Component not re-rendering | Check if state changed; verify hooks dependency array |
| Type errors | Run `npm run type-check` to see all errors |
| Build failed | Clear cache: `rm -rf dist node_modules` then `npm install` |
| Styling not applied | Check CSS class name; verify import order |
| API calls failing | Check `.env` VITE_API_BASE_URL; verify CORS setup |

---

**Happy Coding! 🎉**
