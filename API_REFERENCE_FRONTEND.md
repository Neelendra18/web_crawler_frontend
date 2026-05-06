# Frontend API Reference

Complete reference for using the crawler service in React components.

## Import

```typescript
import { crawlerService } from '@services/crawlerService';
```

## Methods

### startCrawl()

Start a new web crawl job.

```typescript
const response = await crawlerService.startCrawl({
  base_url: 'https://example.com',
  max_depth: 2,
  excluded_urls: '/logout, /admin/*, /api/*',
});

// Returns:
// {
//   job_id: 'uuid-string'
// }
```

**Parameters:**

- `base_url` (string): URL to crawl (required, must be valid URL)
- `max_depth` (number): 1-10, default 2
- `excluded_urls` (string): Comma-separated patterns to skip

**Throws:**

- Error with message if URL invalid or backend error

---

### getCrawlStatus()

Get current status of a running crawl.

```typescript
const status = await crawlerService.getCrawlStatus(jobId);

// Returns:
// {
//   job_id: 'uuid-string',
//   status: 'pending' | 'running' | 'completed' | 'stopped' | 'failed' | 'revoked',
//   unique_urls_discovered: 42
// }
```

**Parameters:**

- `jobId` (string): Job ID from `startCrawl()` response

**Status Values:**

- `pending`: Job queued, starting soon
- `running`: Currently crawling
- `completed`: Finished successfully
- `stopped`: User stopped it
- `failed`: Error occurred
- `revoked`: System cancelled it

---

### getCrawlResults()

Get all crawled pages and results.

```typescript
const results = await crawlerService.getCrawlResults(jobId);

// Returns:
// {
//   job_id: 'uuid-string',
//   status: 'completed',
//   pages: [
//     {
//       url: 'https://example.com/',
//       depth: 0,
//       status_code: 200,
//       title: 'Example Domain',
//       links_found: 5,
//       error: null
//     },
//     // ... more pages
//   ]
// }
```

**Parameters:**

- `jobId` (string): Job ID

**Returns:**

- `job_id`: The job ID
- `status`: Current job status
- `pages`: Array of crawled pages

**Page Object:**

- `url`: Full URL of the page
- `depth`: How deep (0 = root)
- `status_code`: HTTP status (200, 404, etc)
- `title`: Page title (if available)
- `links_found`: Number of links on page
- `error`: Error message if page failed

---

### getCrawledUrls()

Get list of all discovered URLs.

```typescript
const urls = await crawlerService.getCrawledUrls(jobId);

// Returns:
// {
//   job_id: 'uuid-string',
//   status: 'running',
//   urls: [
//     'https://example.com/',
//     'https://example.com/about',
//     'https://example.com/contact'
//   ]
// }
```

---

### getSitemap()

Get site structure and hierarchy.

```typescript
const sitemap = await crawlerService.getSitemap(jobId);

// Returns:
// {
//   site_url: 'https://example.com',
//   total_pages_crawled: 10,
//   crawled_at: '2026-05-04T16:56:36.044288+00:00',
//   url_tree: {
//     url: '/',
//     page_id: 'uuid-v5',
//     title: 'Home',
//     has_page_data: true,
//     children: [
//       {
//         url: '/about',
//         page_id: 'uuid-v5',
//         title: 'About',
//         children: []
//       }
//     ]
//   },
//   page_summaries: [
//     {
//       page_id: 'uuid-v5',
//       url: '/',
//       title: 'Home',
//       meta_description: 'Welcome to example.com'
//     }
//   ],
//   shared_navigation: {
//     header: ['Home', 'About', 'Contact'],
//     footer: ['Privacy', 'Terms']
//   },
//   external_destinations: [
//     {
//       url: 'https://other.com',
//       referenced_as: 'Partner'
//     }
//   ]
// }
```

---

### getProcessedPage()

Get LLM-ready processed data for a page.

```typescript
const page = await crawlerService.getProcessedPage(jobId, pageId);

// Returns:
// {
//   page_id: 'uuid-v5',
//   crawl_job_id: 'uuid-string',
//   url: 'https://example.com/page',
//   title: 'Page Title',
//   actionable_elements: [...],
//   breadcrumbs: ['Home', 'Section', 'Page'],
//   headings_outline: [...],
//   body_text: 'Full page text content...',
//   metadata: { ... },
//   response_status: 200,
//   processed_at: '2026-05-04T16:56:36.113659+00:00'
// }
```

**Note:** `page_id` is a UUID v5 derived from job_id and URL.

---

### getPageRaw()

Get raw HTML of a page.

```typescript
const page = await crawlerService.getPageRaw(jobId, url);

// Returns:
// {
//   url: 'https://example.com/',
//   html: '<!DOCTYPE html>...',
//   status_code: 200
// }
```

---

### getPageMarkdown()

Get page content as markdown.

```typescript
const markdown = await crawlerService.getPageMarkdown(jobId, url);

// Returns: Plain text markdown string
// # Page Title
//
// Page content here...
```

---

### stopCrawl()

Stop a running crawl immediately.

```typescript
const result = await crawlerService.stopCrawl(jobId);

// Returns:
// {
//   job_id: 'uuid-string',
//   status: 'stopped',
//   message: 'Crawl stopped successfully'
// }
```

**Note:** Can only stop "running" or "pending" jobs.

---

### pauseCrawl()

Pause a running crawl (can be resumed).

```typescript
const result = await crawlerService.pauseCrawl(jobId);

// Returns:
// {
//   job_id: 'uuid-string',
//   status: 'paused',
//   message: 'Crawl paused successfully'
// }
```

**Errors:**

- "Cannot pause job with status: revoked" - Job already stopped
- "Cannot pause job with status: completed" - Job already finished

---

### resumeCrawl()

Resume a paused crawl.

```typescript
const result = await crawlerService.resumeCrawl(jobId);

// Returns:
// {
//   job_id: 'uuid-string',
//   status: 'running',
//   message: 'Crawl resumed successfully'
// }
```

**Note:** Job must be in "paused" status to resume.

---

### exportCrawl()

Download crawl results as ZIP file.

```typescript
const blob = await crawlerService.exportCrawl(jobId);

// Now save/download
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = `crawl-${jobId}.zip`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
window.URL.revokeObjectURL(url);
```

---

### deleteCrawl()

Delete a crawl job and all associated data.

```typescript
const result = await crawlerService.deleteCrawl(jobId);

// Returns:
// {
//   job_id: 'uuid-string',
//   deleted_crawl_jobs: 1,
//   deleted_crawl_pages: 42,
//   deleted_crawl_sitemaps: 1,
//   deleted_processed_pages: 42
// }
```

**Warning:** This is permanent. Cannot be undone.

---

### deleteCrawlPage()

Delete a specific page from a crawl.

```typescript
const result = await crawlerService.deleteCrawlPage(jobId, url);

// Returns:
// {
//   job_id: 'uuid-string',
//   url: 'https://example.com/page',
//   deleted_crawl_pages: 1,
//   deleted_processed_pages: 1
// }
```

---

### waitForCrawlCompletion()

Utility function to poll until crawl completes.

```typescript
const finalStatus = await crawlerService.waitForCrawlCompletion(
  jobId,
  (maxAttempts = 60), // Max 60 polls = 60 seconds
  (pollingInterval = 1000), // Poll every 1 second
);

// Returns final status when completed
```

**Throws:**

- Error if exceeds max attempts without completion

**Example:**

```typescript
try {
  const status = await crawlerService.waitForCrawlCompletion(jobId);
  console.log(`Crawl ${status.status}`);
} catch (err) {
  console.error('Crawl timeout:', err.message);
}
```

---

## Usage Patterns

### Pattern 1: Start and Poll

```typescript
// Start
const { job_id } = await crawlerService.startCrawl({
  base_url: 'https://example.com',
  max_depth: 2,
});

// Poll until complete
const finalStatus = await crawlerService.waitForCrawlCompletion(job_id);

// Get results
const results = await crawlerService.getCrawlResults(job_id);
```

### Pattern 2: Manual Polling (for UI updates)

```typescript
const [status, setStatus] = useState<string>('pending');

useEffect(() => {
  const interval = setInterval(async () => {
    const s = await crawlerService.getCrawlStatus(jobId);
    setStatus(s.status);

    if (s.status === 'completed') {
      clearInterval(interval);
    }
  }, 2000); // Poll every 2 seconds

  return () => clearInterval(interval);
}, [jobId]);
```

### Pattern 3: With Abort Controller

```typescript
const abortController = new AbortController();

try {
  await crawlerService.startCrawl(request, {
    signal: abortController.signal,
  });
} catch (err) {
  if (err.message === 'Request cancelled') {
    console.log('User cancelled request');
  }
}

// User clicks cancel
abortController.abort();
```

### Pattern 4: Error Handling

```typescript
try {
  const response = await crawlerService.startCrawl({
    base_url: 'https://invalid..url',
    max_depth: 2,
  });
} catch (err) {
  // Error is already formatted by service
  console.error(err.message); // User-friendly error

  // Show to user
  setError(err.message);
}
```

---

## Error Handling

All methods throw `Error` with user-friendly messages:

```typescript
try {
  await crawlerService.startCrawl(...)
} catch (err) {
  if (err instanceof Error) {
    console.log(err.message)
    // Examples:
    // "Unauthorized. Please log in."
    // "Job not found."
    // "Invalid request."
    // "Cannot pause job with status: revoked"
  }
}
```

---

## Types

Import all types from `@app-types/index`:

```typescript
import type {
  CrawlStartRequest,
  CrawlStartResponse,
  CrawlStatusResponse,
  CrawlResultsResponse,
  CrawlUrlsResponse,
  CrawlSitemapResponse,
  ProcessedPageResponse,
  CrawlPageResult,
  CrawlStopResponse,
  CrawlDeleteResponse,
  CrawlDeletePageResponse,
} from '@app-types/index';
```

---

## Request Options

All methods accept optional `RequestOptions`:

```typescript
interface RequestOptions {
  signal?: AbortSignal;
}

// Usage
await crawlerService.getCrawlStatus(jobId, {
  signal: abortController.signal,
});
```

---

## Constants

### Crawl Status Values

```typescript
const CRAWL_STATUSES = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  STOPPED: 'stopped',
  FAILED: 'failed',
  REVOKED: 'revoked',
  PAUSED: 'paused',
} as const;
```

### Depth Range

```typescript
const DEPTH_RANGE = {
  MIN: 1,
  MAX: 10,
  DEFAULT: 2,
} as const;
```

---

## Environment

The service uses base URL from config:

```typescript
import { config } from '@utils/config';
console.log(config.apiBaseUrl); // 'http://localhost:8000'
console.log(config.apiTimeout); // 30000
```

---

## Examples in Components

### Example 1: Simple Crawl Form

```typescript
const [url, setUrl] = useState('')
const [loading, setLoading] = useState(false)
const [jobId, setJobId] = useState('')

const handleStart = async () => {
  setLoading(true)
  try {
    const { job_id } = await crawlerService.startCrawl({
      base_url: url,
      max_depth: 2
    })
    setJobId(job_id)
  } catch (err) {
    console.error(err.message)
  } finally {
    setLoading(false)
  }
}

return (
  <>
    <input
      type="url"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="https://example.com"
    />
    <button onClick={handleStart} disabled={loading}>
      {loading ? 'Starting...' : 'Start Crawl'}
    </button>
    {jobId && <p>Job ID: {jobId}</p>}
  </>
)
```

### Example 2: Status Display

```typescript
const [status, setStatus] = useState<CrawlStatusResponse | null>(null)

useEffect(() => {
  if (!jobId) return

  const interval = setInterval(async () => {
    try {
      const s = await crawlerService.getCrawlStatus(jobId)
      setStatus(s)
    } catch (err) {
      console.error('Status error:', err)
    }
  }, 2000)

  return () => clearInterval(interval)
}, [jobId])

return status ? (
  <>
    <p>Status: {status.status}</p>
    <p>URLs Found: {status.unique_urls_discovered}</p>
  </>
) : null
```

### Example 3: Results Display

```typescript
const [results, setResults] = useState<CrawlResultsResponse | null>(null)

useEffect(() => {
  if (!jobId || !status || status.status !== 'completed') return

  crawlerService.getCrawlResults(jobId).then(setResults)
}, [jobId, status?.status])

return results?.pages.map((page, i) => (
  <div key={i}>
    <h3>{page.title}</h3>
    <p>{page.url}</p>
    <p>Status: {page.status_code}</p>
  </div>
)) || null
```

---
