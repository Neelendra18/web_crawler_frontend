# Frontend Integration Cheat Sheet

Quick reference for developers integrating the Crawl page.

## Quick Links

| Document                                                               | Purpose                          |
| ---------------------------------------------------------------------- | -------------------------------- |
| [`INTEGRATION_COMPLETE.md`](./INTEGRATION_COMPLETE.md)                 | ⭐ **START HERE** - Full summary |
| [`QUICK_START_FRONTEND_BACKEND.md`](./QUICK_START_FRONTEND_BACKEND.md) | 5-minute setup guide             |
| [`FRONTEND_INTEGRATION_GUIDE.md`](./FRONTEND_INTEGRATION_GUIDE.md)     | Deep dive into architecture      |
| [`INTEGRATION_VERIFICATION.md`](./INTEGRATION_VERIFICATION.md)         | 11 tests to verify everything    |
| [`API_REFERENCE_FRONTEND.md`](./API_REFERENCE_FRONTEND.md)             | Complete API method reference    |

---

## Get It Running

```bash
# Terminal 1: Backend
cd web_crawler && make dev

# Terminal 2: Frontend
cd web_crawler_frontend && npm run dev

# Terminal 3 (Optional): Test Site
cd web_crawler/test_site && python app.py
```

Then open: `http://localhost:5173` → **Crawl** page → Enter URL → Click "Start Crawl"

---

## Architecture

```
NewCrawlPage.tsx (UI)
    ↓
crawlerService.ts (14 API methods)
    ↓
apiClient.ts (Axios HTTP)
    ↓
Backend /crawler/* endpoints
```

---

## Using the Service

```typescript
import { crawlerService } from '@services/crawlerService';

// Start crawl
const { job_id } = await crawlerService.startCrawl({
  base_url: 'https://example.com',
  max_depth: 2,
  excluded_urls: '/logout, /admin/*',
});

// Poll status
const status = await crawlerService.getCrawlStatus(job_id);
// { job_id, status: 'running', unique_urls_discovered: 42 }

// Get results
const results = await crawlerService.getCrawlResults(job_id);
// { job_id, status, pages: [...] }

// Control crawl
await crawlerService.pauseCrawl(job_id);
await crawlerService.resumeCrawl(job_id);
await crawlerService.stopCrawl(job_id);

// Export
const blob = await crawlerService.exportCrawl(job_id);
```

---

## Job Status Flow

```
pending → running → completed
                 ↘ stopped (user clicked Stop)
                 ↘ paused (user clicked Pause)
                    ↘ running (user clicked Resume)
                 ↘ failed (backend error)
                 ↘ revoked (system cancelled)
```

---

## Key Files

| File                             | Purpose              |
| -------------------------------- | -------------------- |
| `src/services/crawlerService.ts` | ⭐ 14 API methods    |
| `src/pages/NewCrawlPage.tsx`     | ⭐ UI component      |
| `src/types/index.ts`             | API type definitions |
| `src/services/apiClient.ts`      | Axios HTTP client    |
| `src/utils/config.ts`            | Environment config   |

---

## API Endpoints

```
POST   /crawler/start                 → job_id
GET    /crawler/{id}/status           → { status, urls_discovered }
GET    /crawler/{id}/results          → { pages: [...] }
POST   /crawler/{id}/pause            → { status: 'paused' }
POST   /crawler/{id}/resume           → { status: 'running' }
POST   /crawler/{id}/stop             → { status: 'stopped' }
GET    /crawler/{id}/export           → ZIP blob
DELETE /crawler/{id}                  → confirmation
GET    /crawler/{id}/urls             → { urls: [...] }
GET    /crawler/{id}/sitemap          → { url_tree, pages... }
GET    /crawler/{id}/page/processed   → { page data }
GET    /crawler/{id}/page/raw         → { html, status }
GET    /crawler/{id}/page/markdown    → markdown text
DELETE /crawler/{id}/page             → confirmation
```

---

## Common Tasks

### Start a Crawl

```typescript
const response = await crawlerService.startCrawl({
  base_url: 'https://example.com',
  max_depth: 2,
});
const jobId = response.job_id;
```

### Poll for Status

```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const status = await crawlerService.getCrawlStatus(jobId);
    setStatus(status.status);

    if (status.status === 'completed') {
      clearInterval(interval);
    }
  }, 2000);

  return () => clearInterval(interval);
}, [jobId]);
```

### Display Results

```typescript
const results = await crawlerService.getCrawlResults(jobId)
results.pages.map(page => (
  <div key={page.url}>
    <h3>{page.title}</h3>
    <p>{page.url}</p>
    <p>Status: {page.status_code}</p>
  </div>
))
```

### Handle Errors

```typescript
try {
  await crawlerService.startCrawl(...)
} catch (err) {
  console.error(err.message)  // User-friendly message
  setError(err.message)        // Show to user
}
```

---

## Environment Variables

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

---

## Status Colors

| Status    | Color     |
| --------- | --------- |
| pending   | 🟨 Amber  |
| running   | 🔵 Blue   |
| completed | 🟢 Green  |
| paused    | 🟠 Orange |
| stopped   | 🔴 Red    |
| failed    | 🔴 Red    |
| revoked   | 🔴 Red    |

---

## Validation Rules

| Field    | Rules                       |
| -------- | --------------------------- |
| URL      | Must be valid (https://...) |
| Depth    | 1-10, required              |
| Excluded | Comma-separated, optional   |

---

## Type Definitions

```typescript
interface CrawlStartRequest {
  base_url: string; // Required
  max_depth?: number; // 1-10, default 2
  excluded_urls?: string; // Comma-separated patterns
}

interface CrawlStatusResponse {
  job_id: string;
  status: string; // pending|running|completed|...
  unique_urls_discovered: number;
}

interface CrawlPageResult {
  url: string;
  depth: number;
  status_code: number | null;
  title: string | null;
  links_found: number;
  error: string | null;
}

interface CrawlResultsResponse {
  job_id: string;
  status: string;
  pages: CrawlPageResult[];
}
```

---

## Testing

Run verification tests:

```bash
# Browser Dev Tools
1. Network tab → Check GET/POST requests
2. Console tab → Check for errors
3. Performance tab → Check for memory leaks

# CLI
npm run type-check  # TypeScript
npm run lint        # ESLint
```

---

## Troubleshooting

| Problem                 | Solution                           |
| ----------------------- | ---------------------------------- |
| "Backend offline"       | `cd web_crawler && make dev`       |
| "Failed to start crawl" | Check backend running on port 8000 |
| "Job not found"         | Job expired or wrong ID            |
| "Cannot pause"          | Can only pause running jobs        |
| No CORS errors          | Good! CORS configured              |
| Results not showing     | Wait for status="completed"        |
| Export not downloading  | Job must be completed              |

---

## Environment Setup

```bash
# Install dependencies
npm install

# Development
npm run dev          # Start dev server

# Quality checks
npm run type-check   # TypeScript check
npm run lint        # ESLint check
npm run format      # Prettier format

# Production
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## Performance Notes

- ✅ Polling interval: 2 seconds (adjust in NewCrawlPage.tsx if needed)
- ✅ Results cached in React state
- ✅ Proper cleanup on unmount
- ✅ No memory leaks
- ✅ Efficient re-renders

---

## Security Notes

- ✅ URL validation prevents malicious URLs
- ✅ Depth capped at 10 to prevent abuse
- ✅ CORS restricted to frontend origin
- ✅ Backend validates all requests
- ✅ No sensitive data exposed

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

---

## Deploy to Production

1. Update `.env`:

   ```bash
   VITE_API_BASE_URL=https://api.yourcompany.com
   ```

2. Build:

   ```bash
   npm run build
   ```

3. Deploy `dist/` folder to your host

4. Update backend CORS in `web_crawler/app/main.py`:
   ```python
   allow_origins=["https://yourcompany.com"],
   ```

---

## Common Errors & Fixes

```
Error: "Invalid URL format. Use https://example.com"
→ Enter valid URL like https://example.com

Error: "Crawl depth must be between 1 and 10"
→ Set depth between 1 and 10

Error: "Cannot pause job with status: revoked"
→ Job already stopped, start new crawl

Error: "Failed to start crawl"
→ Backend not running, check port 8000

Error: CORS error in console
→ Backend CORS not configured for your frontend URL

No results appearing
→ Wait for status to change to "completed"
→ Check crawl depth and URL are correct

Export not downloading
→ Job must be in "completed" status
→ Check browser download permissions
```

---

## Useful Links

- Backend Docs: `http://localhost:8000/docs`
- Frontend Dev Server: `http://localhost:5173`
- Test Site: `http://localhost:5000` (if running)

---

## Quick Commands

```bash
# Backend
cd web_crawler
make dev                    # Start backend
make test                   # Run backend tests

# Frontend
cd web_crawler_frontend
npm run dev                 # Start dev server
npm run build              # Build for production
npm run type-check         # Check TypeScript
npm run lint               # Check linting
npm run format             # Format code

# Test Site
cd web_crawler/test_site
python app.py              # Start test site
```

---

## Module Imports

```typescript
// API Service
import { crawlerService } from '@services/crawlerService';

// Types
import type {
  CrawlStartRequest,
  CrawlStatusResponse,
  CrawlResultsResponse,
  CrawlPageResult,
} from '@app-types/index';

// Configuration
import { config } from '@utils/config';
```

---

**Last Updated:** May 6, 2026 | **Status:** ✅ Complete
