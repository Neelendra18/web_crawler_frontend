# Quick Start: Frontend-Backend Integration

## TL;DR - Get It Working in 5 Minutes

### Prerequisites

- Backend running on `http://localhost:8000`
- Frontend dependencies installed

### Step 1: Start the Backend

```bash
cd web_crawler
make dev
```

Verify it's running: Open `http://localhost:8000/docs` in browser

### Step 2: Start the Frontend

```bash
cd web_crawler_frontend
npm run dev
```

Frontend will open at `http://localhost:3000` or `http://localhost:5173`

### Step 3: Use the Crawl Page

1. Navigate to the **Crawl** page in the UI
2. Enter a URL: `https://example.com`
3. Set Crawl Depth: `2` (recommended)
4. Click **Start Crawl**
5. Watch live status updates as it crawls

### Step 4: View Results

- See discovered URLs counter in real-time
- View crawled pages with title, depth, status
- Export results as ZIP when complete

---

## Testing with Local Test Site

For safe testing without hitting real websites:

```bash
# Terminal 3: Start the test site
cd web_crawler/test_site
python app.py
```

Test site runs on `http://localhost:5000`

### In Crawl Page:

1. Enter URL: `http://localhost:5000`
2. Set Depth: `2`
3. Click Start Crawl
4. Should find several test pages

---

## API Endpoints Summary

All requests go to `http://localhost:8000/crawler/`:

| What         | Method | Endpoint            | Status     |
| ------------ | ------ | ------------------- | ---------- |
| Start crawl  | POST   | `/start`            | ✅ Working |
| Check status | GET    | `/{job_id}/status`  | ✅ Working |
| Get results  | GET    | `/{job_id}/results` | ✅ Working |
| Pause crawl  | POST   | `/{job_id}/pause`   | ✅ Working |
| Resume crawl | POST   | `/{job_id}/resume`  | ✅ Working |
| Stop crawl   | POST   | `/{job_id}/stop`    | ✅ Working |
| Export ZIP   | GET    | `/{job_id}/export`  | ✅ Working |

---

## Common Errors & Fixes

### Error: "Failed to start crawl"

**Solution:** Backend not running. Run:

```bash
cd web_crawler && make dev
```

### Error: "Job not found"

**Solution:** Job ID expired or wrong URL. Start a new crawl.

### Error: "Cannot pause job with status: revoked"

**Solution:** Job was already stopped. Cannot pause stopped jobs. Start a new one.

### No results appearing

**Solution:**

- Wait for status to change to "completed"
- Check crawl depth and URL are correct
- Check backend logs for errors

---

## File Changes Made

### Created/Modified Files

1. **`src/services/crawlerService.ts`** (UPDATED)
   - Added 14 API methods matching all backend endpoints
   - Centralized error handling
   - Polling support

2. **`src/pages/NewCrawlPage.tsx`** (UPDATED)
   - Full integration with backend API
   - Real-time status polling
   - Results display
   - Crawl history tracking
   - Error handling

3. **`src/types/index.ts`** (UPDATED)
   - All backend API types
   - Response types for all endpoints

4. **`.env.example`** (UPDATED)
   - Added comment about backend port

5. **`FRONTEND_INTEGRATION_GUIDE.md`** (NEW)
   - Comprehensive integration documentation

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Frontend (React + TypeScript)           │
│  web_crawler_frontend:3000                      │
├─────────────────────────────────────────────────┤
│  NewCrawlPage.tsx                               │
│   ├─ Form: URL, Depth, Excluded URLs            │
│   ├─ State: job, status, results                │
│   └─ Effects: polling, error handling           │
├─────────────────────────────────────────────────┤
│  crawlerService.ts                              │
│   └─ 14 API methods wrapping backend endpoints  │
├─────────────────────────────────────────────────┤
│  apiClient.ts                                   │
│   └─ Axios HTTP client with interceptors        │
└──────────────────┬──────────────────────────────┘
                   │ HTTP/JSON
                   │ CORS enabled
                   ↓
┌─────────────────────────────────────────────────┐
│       Backend (FastAPI + Python)                │
│  web_crawler:8000                               │
├─────────────────────────────────────────────────┤
│  /crawler/start                  → job_id       │
│  /crawler/{job_id}/status        → status       │
│  /crawler/{job_id}/results       → pages        │
│  /crawler/{job_id}/pause         → paused       │
│  /crawler/{job_id}/resume        → running      │
│  /crawler/{job_id}/stop          → stopped      │
│  ... (14 endpoints total)                       │
└─────────────────────────────────────────────────┘
```

---

## Key Features Implemented

✅ Form validation (URL format, depth range)
✅ Real-time status polling every 2 seconds  
✅ Auto-refresh results when complete
✅ Pause/Resume/Stop controls
✅ Export results as ZIP
✅ Crawl history tracking
✅ Error messages (user-friendly)
✅ Loading indicators
✅ Disabled inputs during crawl
✅ Graceful error handling
✅ Clean service layer architecture
✅ Full TypeScript typing

---

## Production Deployment

Before going to production:

1. Update `.env`:

   ```bash
   VITE_API_BASE_URL=https://api.yourcompany.com
   ```

2. Update backend CORS in `web_crawler/app/main.py`:

   ```python
   allow_origins=["https://yourcompany.com"],
   ```

3. Build frontend:

   ```bash
   npm run build
   ```

4. Deploy to your hosting provider

---

## Questions?

See `FRONTEND_INTEGRATION_GUIDE.md` for detailed documentation.
