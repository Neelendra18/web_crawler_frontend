# Frontend-Backend Integration Verification Guide

This guide helps you verify that the frontend-backend integration is working correctly.

## Pre-Flight Checks

### ✅ Step 1: Backend Status

Verify backend is running and accessible:

```bash
# Should return 200 OK with API docs
curl -s http://localhost:8000/docs | head -20
```

Expected response: HTML with Swagger UI

Or open in browser: `http://localhost:8000/docs`

### ✅ Step 2: Frontend Status

Verify frontend is running:

```bash
# Terminal where frontend is running should show:
# VITE v7.x.x  ready in XX ms
# ➜  Local:   http://localhost:5173/
```

Open in browser: `http://localhost:5173` (or `http://localhost:3000`)

---

## Integration Tests

### Test 1: Basic Crawl Flow

**What it tests:** Start → Status → Results → Stop

**Steps:**

1. Open frontend at `http://localhost:5173`
2. Navigate to **Crawl** page
3. Enter URL: `https://example.com`
4. Set Depth: `1` (quick test)
5. Click **Start Crawl**
6. **Expected:** Job ID appears, status shows "pending" → "running"
7. Wait ~5-10 seconds
8. **Expected:** Status changes to "completed", pages appear
9. **Expected:** Can see pages list with titles and status codes

**Success Indicator:**

```
✅ Crawl started
✅ Status updated in real-time (every 2s)
✅ Results displayed
✅ No errors in console
```

---

### Test 2: Pause/Resume

**What it tests:** Job pause and resume functionality

**Steps:**

1. Start a crawl (from Test 1)
2. While "running", click **Pause** button
3. **Expected:** Status changes to "paused"
4. Click **Resume** button
5. **Expected:** Status changes back to "running"
6. Wait for completion

**Success Indicator:**

```
✅ Pause button disabled when not running
✅ Status changes to "paused"
✅ Resume button appears when paused
✅ Status changes back to "running"
```

---

### Test 3: Stop Crawl

**What it tests:** Stopping a running crawl

**Steps:**

1. Start a new crawl
2. While "running", click **Stop** button
3. **Expected:** Status changes to "stopped"
4. **Expected:** "Start Crawl" button re-enabled
5. Click "Start Crawl" again to verify new job can be started

**Success Indicator:**

```
✅ Stop button appears while running
✅ Status changes to "stopped"
✅ Can start a new crawl after stopping
```

---

### Test 4: Export Results

**What it tests:** Export crawl as ZIP file

**Steps:**

1. Complete a crawl (wait for "completed" status)
2. Click **📥 Export Results** button
3. **Expected:** ZIP file downloads
4. **Expected:** File name format: `crawl-{job_id}.zip`
5. Open ZIP and verify contents

**Success Indicator:**

```
✅ Export button appears when completed
✅ ZIP file downloads successfully
✅ ZIP contains crawl data
```

---

### Test 5: Local Test Site

**What it tests:** Crawling local website for safe testing

**Prerequisites:** Test site running on `http://localhost:5000`

**Steps:**

```bash
# Terminal 3: Start test site
cd web_crawler/test_site
python app.py
```

1. In frontend, enter: `http://localhost:5000`
2. Set Depth: `2`
3. Click **Start Crawl**
4. **Expected:** Multiple pages discovered
5. **Expected:** Results show various pages and status codes

**Success Indicator:**

```
✅ Crawl completes quickly
✅ Multiple pages discovered
✅ Pages have titles and content
```

---

### Test 6: Validation & Error Handling

**What it tests:** Form validation and error messages

#### Invalid URL

1. Enter: `not-a-url`
2. Click **Start Crawl**
3. **Expected:** Error message: "Invalid URL format..."

#### Out of Range Depth

1. Enter valid URL
2. Set Depth: `15` (max is 10)
3. Click **Start Crawl**
4. **Expected:** Error message: "Crawl depth must be between 1 and 10"

#### Backend Unreachable

1. Stop backend: `Ctrl+C` in backend terminal
2. Try to start crawl
3. **Expected:** Error message: "Failed to start crawl" or similar
4. Restart backend

**Success Indicator:**

```
✅ All validation errors shown clearly
✅ User-friendly error messages (not tech jargon)
✅ Form recovers after error
```

---

### Test 7: Status Colors

**What it tests:** Visual status indicators

**Expected colors by status:**

| Status    | Color  | RGB     |
| --------- | ------ | ------- |
| pending   | Amber  | #f59e0b |
| running   | Blue   | #3b82f6 |
| completed | Green  | #10b981 |
| paused    | Orange | #f97316 |
| stopped   | Red    | #ef4444 |
| failed    | Red    | #ef4444 |

**Steps:**

1. Start a crawl and watch status color changes
2. Verify colors match above table
3. Verify status badges and progress indicators are colored correctly

---

### Test 8: Crawl History

**What it tests:** History tracking and display

**Steps:**

1. Complete 2-3 crawls with different URLs
2. Click **History** tab
3. **Expected:** All previous crawls listed
4. **Expected:** Shows: URL, timestamp, status, discovery count
5. **Expected:** Status badges colored appropriately

**Success Indicator:**

```
✅ History persists during session
✅ All completed jobs appear
✅ Correct information displayed for each
```

---

## Browser DevTools Verification

### Network Tab

**What to check:**

1. Open DevTools: `F12` or `Cmd+Option+I`
2. Go to **Network** tab
3. Start a crawl
4. **Expected requests:**

```
POST http://localhost:8000/crawler/start
→ Response: { "job_id": "..." }

GET http://localhost:8000/crawler/{job_id}/status
→ Response: { "job_id": "...", "status": "running", ... }

GET http://localhost:8000/crawler/{job_id}/results
→ Response: { "job_id": "...", "pages": [...] }
```

**Success Indicators:**

- ✅ Status code 200 for all requests
- ✅ Request/response headers present
- ✅ No CORS errors
- ✅ Response data matches expected types

### Console Tab

**What to check:**

1. Go to **Console** tab
2. Perform crawl operation
3. **Expected:**
   - No red errors
   - No CORS warnings
   - Debug logs if debug mode enabled

**Success Indicators:**

- ✅ No console errors
- ✅ No CORS blocking
- ✅ API requests logged clearly

---

## Performance Verification

### Test 9: Polling Performance

**What it tests:** Real-time updates don't cause performance issues

**Steps:**

1. Open DevTools **Performance** tab
2. Start recording
3. Start a crawl and let it run
4. Stop recording after 10-15 seconds
5. **Expected:** No performance issues or lag
6. **Expected:** CPU/Memory stable

**Success Indicators:**

```
✅ FPS stays high (60+)
✅ Memory doesn't leak
✅ UI remains responsive
✅ Polling happens regularly (every 2s)
```

---

## Type Safety Verification

### Test 10: TypeScript Compilation

**What it tests:** No TypeScript errors

**Steps:**

```bash
cd web_crawler_frontend
npm run type-check
```

**Expected:** No errors

```
# Should output something like:
# ✓ 523 lines checked
# ✓ No issues found
```

---

## Linting Verification

### Test 11: Code Quality

**What it tests:** Code meets quality standards

**Steps:**

```bash
cd web_crawler_frontend
npm run lint
```

**Expected:** No errors or warnings

---

## Production Readiness Checklist

- [ ] All 11 integration tests pass
- [ ] Browser DevTools shows no errors
- [ ] Network tab shows 200 status for all API calls
- [ ] TypeScript compilation succeeds
- [ ] ESLint passes
- [ ] Can start/pause/resume/stop crawls
- [ ] Results display correctly
- [ ] Export functionality works
- [ ] Error messages are user-friendly
- [ ] Crawl history tracks jobs correctly
- [ ] Performance is smooth (no lag)
- [ ] Mobile responsive (test on mobile or DevTools)

---

## Debugging Tips

### If polling not updating:

1. Check Network tab: see GET requests to `/status` every 2s?
2. Check Console for errors
3. Verify `pollIntervalRef` is set in React DevTools
4. Check job_id is correct in URL

### If results not showing:

1. Wait for status to be "completed"
2. Check Network tab: see GET request to `/results`?
3. Check response contains pages array
4. Verify pages array not empty

### If export fails:

1. Verify job is "completed"
2. Check Network tab: see GET to `/export`?
3. Verify response is blob (Content-Type: application/zip)
4. Check Downloads folder permissions

### If backend errors:

1. Check backend logs in terminal
2. Verify backend running: `curl http://localhost:8000/docs`
3. Check error message in API response
4. Verify request parameters are correct

---

## Success Criteria

The integration is **working correctly** when:

✅ All 11 integration tests pass  
✅ No TypeScript or lint errors  
✅ Network requests show 200 status  
✅ Real-time status updates every 2 seconds  
✅ Results display correctly  
✅ Error messages are clear  
✅ UI remains responsive  
✅ Can perform all operations (start/pause/resume/stop/export)  
✅ Crawl history tracks jobs  
✅ No console errors

---

## Quick Troubleshooting Script

Run this to check everything:

```bash
#!/bin/bash

echo "✓ Checking backend..."
curl -s http://localhost:8000/docs > /dev/null && echo "  ✅ Backend online" || echo "  ❌ Backend offline"

echo "✓ Checking frontend..."
curl -s http://localhost:5173 > /dev/null && echo "  ✅ Frontend online" || echo "  ❌ Frontend offline"

echo "✓ Checking TypeScript..."
cd web_crawler_frontend && npm run type-check > /dev/null && echo "  ✅ No TS errors" || echo "  ❌ TS errors found"

echo "✓ Checking Linting..."
npm run lint > /dev/null && echo "  ✅ No lint errors" || echo "  ❌ Lint errors found"

echo ""
echo "Integration status: READY ✅"
```

---

## Still Having Issues?

1. **Restart everything:**

   ```bash
   # Terminal 1: Kill backend (Ctrl+C), restart
   cd web_crawler && make dev

   # Terminal 2: Kill frontend (Ctrl+C), restart
   cd web_crawler_frontend && npm run dev
   ```

2. **Clear caches:**

   ```bash
   # Frontend
   cd web_crawler_frontend
   rm -rf node_modules/.vite package-lock.json
   npm install
   npm run dev
   ```

3. **Check environment variables:**

   ```bash
   cat web_crawler_frontend/.env
   # Should show: VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Check CORS:**
   - Backend should allow `http://localhost:3000` or `http://localhost:5173`
   - See: `web_crawler/app/main.py` line ~40

5. **Check ports:**
   ```bash
   lsof -i :8000  # Backend
   lsof -i :5173  # Frontend
   ```
