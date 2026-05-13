# Frontend Backend Integration Guide

## Overview

This document explains how the **web_crawler_frontend** is integrated with the **web_crawler** backend API.

## Project Structure

```
web_crawler_frontend/
├── src/
│   ├── services/
│   │   ├── apiClient.ts           # Axios HTTP client with interceptors
│   │   └── crawlerService.ts      # Backend API service layer (NEW)
│   ├── pages/
│   │   └── NewCrawlPage.tsx       # Crawl UI component (UPDATED)
│   ├── types/
│   │   └── index.ts               # TypeScript types (UPDATED)
│   └── utils/
│       └── config.ts              # Environment config
├── .env.example                    # Environment variables template
└── package.json                    # Dependencies (axios, etc)
```

## Backend API Integration

### Base URL Configuration

The backend API base URL is configured via environment variable:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

The config is loaded in `src/utils/config.ts` and used by `src/services/apiClient.ts`.

### API Service Layer

**File:** `src/services/crawlerService.ts`

This service provides a clean API to interact with all backend endpoints:

#### Endpoints Implemented

| Method | Endpoint                           | Function             | Status |
| ------ | ---------------------------------- | -------------------- | ------ |
| POST   | `/crawler/start`                   | `startCrawl()`       | ✅     |
| GET    | `/crawler/{job_id}/status`         | `getCrawlStatus()`   | ✅     |
| GET    | `/crawler/{job_id}/results`        | `getCrawlResults()`  | ✅     |
| GET    | `/crawler/{job_id}/urls`           | `getCrawledUrls()`   | ✅     |
| GET    | `/crawler/{job_id}/sitemap`        | `getSitemap()`       | ✅     |
| GET    | `/crawler/{job_id}/page/processed` | `getProcessedPage()` | ✅     |
| GET    | `/crawler/{job_id}/page/raw`       | `getPageRaw()`       | ✅     |
| GET    | `/crawler/{job_id}/page/markdown`  | `getPageMarkdown()`  | ✅     |
| POST   | `/crawler/{job_id}/stop`           | `stopCrawl()`        | ✅     |
| POST   | `/crawler/{job_id}/pause`          | `pauseCrawl()`       | ✅     |
| POST   | `/crawler/{job_id}/resume`         | `resumeCrawl()`      | ✅     |
| GET    | `/crawler/{job_id}/export`         | `exportCrawl()`      | ✅     |
| DELETE | `/crawler/{job_id}`                | `deleteCrawl()`      | ✅     |
| DELETE | `/crawler/{job_id}/page`           | `deleteCrawlPage()`  | ✅     |

#### Error Handling

The service includes comprehensive error handling:

- Axios error responses are parsed and user-friendly messages are returned
- 401 Unauthorized errors show login prompts
- 404 errors indicate job not found
- 400 errors show validation details
- Cancelled requests are handled gracefully

#### Example Usage

```typescript
import { crawlerService } from '@services/crawlerService';

// Start a crawl
const response = await crawlerService.startCrawl({
  base_url: 'https://example.com',
  max_depth: 2,
  excluded_urls: '/logout, /admin/*',
});
const jobId = response.job_id;

// Get status
const status = await crawlerService.getCrawlStatus(jobId);
console.log(status.status); // 'pending', 'running', 'completed', etc

// Get results
const results = await crawlerService.getCrawlResults(jobId);
console.log(results.pages); // List of crawled pages
```

## Crawl Page Component

**File:** `src/pages/NewCrawlPage.tsx`

### Features Implemented

✅ **Form Inputs**

- Target URL (required, validated)
- Crawl Depth (1-10, default: 2)
- Excluded URLs (optional, comma-separated patterns)

✅ **Job Management**

- Start crawl with validation
- Pause/Resume crawl
- Stop crawl
- Export results as ZIP

✅ **Real-time Status**

- Automatic polling every 2 seconds
- Status indicator with color coding
- URLs discovered counter
- Pages crawled counter

✅ **Results Display**

- Live results table
- Page title, depth, status code
- Links found per page
- Error indicators

✅ **Crawl History**

- History tab tracks all jobs
- Shows URL, status, timestamp
- Click to view job details

✅ **Error Handling**

- URL validation
- Depth validation (1-10 range)
- Backend error messages displayed
- Network error handling
- Graceful degradation

✅ **Loading States**

- Disabled inputs while crawling
- Loading button states
- Loading indicators

### Component State Flow

```
User Input
    ↓
Validation
    ↓
Call crawlerService.startCrawl()
    ↓
Set jobId and status
    ↓
Start polling crawlerService.getCrawlStatus() every 2s
    ↓
Update jobStatus and crawlResults
    ↓
When status === 'completed'
    ↓
Show results in table
```

### Key Hooks Used

- `useState()` - Form inputs, API state, job state
- `useRef()` - Polling interval and abort controller references
- `useEffect()` - Cleanup on unmount, polling effect

## Type Definitions

**File:** `src/types/index.ts`

All backend API types are defined here:

```typescript
// Request types
export interface CrawlStartRequest {
  base_url: string;
  max_depth?: number;
  excluded_urls?: string;
}

// Response types
export interface CrawlStartResponse {
  job_id: string;
}

export interface CrawlStatusResponse {
  job_id: string;
  status: string;
  unique_urls_discovered: number;
}

export interface CrawlResultsResponse {
  job_id: string;
  status: string;
  pages: CrawlPageResult[];
}

// ... more types for all endpoints
```

## Polling & Status Updates

The component implements automatic polling:

```typescript
// Poll every 2 seconds when job is running
useEffect(() => {
  if (!currentJobId || !jobStatus || jobStatus.status === 'completed') {
    clearInterval(pollIntervalRef.current);
    return;
  }

  const pollStatus = async () => {
    const status = await crawlerService.getCrawlStatus(currentJobId);
    setJobStatus(status);

    if (status.status === 'completed') {
      const results = await crawlerService.getCrawlResults(currentJobId);
      setCrawlResults(results);
    }
  };

  pollIntervalRef.current = setInterval(pollStatus, 2000);
}, [currentJobId, jobStatus]);
```

## CORS Configuration

Backend CORS is configured to allow requests from `http://localhost:3000`:

```python
# web_crawler/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, update this in the backend to your frontend URL.

## Running the Full Stack

### Terminal 1: Backend

```bash
cd web_crawler
make dev
# or: python -m uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

### Terminal 2: Frontend

```bash
cd web_crawler_frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` (or `http://localhost:5173` with Vite)

### Terminal 3: Test Site (Optional)

```bash
cd web_crawler/test_site
python app.py
```

Test site runs on `http://localhost:5000` - perfect for testing the crawler locally

## API Contract Matching

The frontend exactly matches the backend API contract:

| Frontend                                                 | Backend    |
| -------------------------------------------------------- | ---------- |
| POST `/crawler/start` → `job_id`                         | ✅ Matched |
| GET `/crawler/{job_id}/status` → status, URLs discovered | ✅ Matched |
| GET `/crawler/{job_id}/results` → pages list             | ✅ Matched |
| POST `/crawler/{job_id}/pause` → status update           | ✅ Matched |
| POST `/crawler/{job_id}/resume` → status update          | ✅ Matched |
| POST `/crawler/{job_id}/stop` → status update            | ✅ Matched |
| DELETE `/crawler/{job_id}` → delete response             | ✅ Matched |
| GET `/crawler/{job_id}/export` → zip blob                | ✅ Matched |

## Production Checklist

- [ ] Update `VITE_API_BASE_URL` in `.env` to production backend URL
- [ ] Update CORS in backend to allow production frontend domain
- [ ] Test all endpoints with production data
- [ ] Set up proper error logging (Sentry)
- [ ] Configure API timeout based on expected crawl times
- [ ] Add request throttling if needed
- [ ] Test with large crawls (high depth, many URLs)
- [ ] Verify export functionality
- [ ] Test mobile responsiveness

## Troubleshooting

### "Failed to start crawl" error

1. Check backend is running: `curl http://localhost:8000/docs`
2. Check CORS: Browser console should not show CORS errors
3. Check URL format: Must be valid URL like `https://example.com`
4. Check backend logs for error details

### Polling not updating

1. Check polling interval is set (every 2s)
2. Check job ID is set correctly
3. Check backend `/status` endpoint is working

### Export not downloading

1. Check job is in 'completed' state
2. Check backend has generated export
3. Check browser allows downloads

## Architecture Notes

This integration follows clean architecture principles:

1. **Separation of Concerns**: API calls in `crawlerService.ts`, UI logic in component
2. **Type Safety**: Full TypeScript typing for all API contracts
3. **Error Handling**: Centralized error handling in service layer
4. **Reusability**: Service can be used from any component
5. **Testability**: Service can be easily mocked for unit tests
6. **Maintainability**: Single source of truth for API endpoints

## Next Steps

### Optional Enhancements

1. **Redux/Zustand Store**: Move state to global store for sharing across pages
2. **Caching**: Cache crawl results to reduce API calls
3. **WebSocket**: Replace polling with WebSocket for real-time updates
4. **Analytics**: Track crawl metrics
5. **Notifications**: Toast/email notifications when crawl completes
6. **Search**: Filter/search crawl history
7. **Batch Operations**: Crawl multiple URLs simultaneously
8. **Scheduling**: Schedule crawls for specific times

## Support

For issues or questions:

1. Check the `EXACT_BACKEND_ENDPOINTS.md` for API details
2. Review backend logs in terminal running the backend
3. Check browser DevTools Network tab for API requests
4. Review frontend console for error messages
