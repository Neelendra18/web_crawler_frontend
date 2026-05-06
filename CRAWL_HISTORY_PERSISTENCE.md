# Crawl History Persistence Guide

## Overview

The Crawl page now **persists crawl history** across page navigation and browser sessions using **browser localStorage**. This means your crawl history will be preserved even if you:

- Navigate away from the Crawl page
- Close the browser tab
- Reload the page
- Return to the dashboard and come back

## What's Fixed

### **Before**

- ❌ Crawl history was lost when navigating away
- ❌ State was cleared when component unmounted
- ❌ No way to access previous crawls after navigation
- ❌ All data only stored in component memory (RAM)

### **After**

- ✅ Crawl history persists across navigation
- ✅ History automatically loaded when page remounts
- ✅ Updates saved in real-time to localStorage
- ✅ Clear History button to manually delete when needed
- ✅ All history survives page reloads and tab closure

## How It Works

### 1. **Save to localStorage on Mount** (Initial Load)

```typescript
// Load history from localStorage on component mount
useEffect(() => {
  try {
    const savedHistory = localStorage.getItem('crawlHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory) as CrawlJob[];
      setCrawlHistory(parsedHistory);
    }
  } catch (err) {
    console.error('Failed to load crawl history from localStorage:', err);
  }
}, []);
```

**What happens:**

- Component loads from localStorage key `'crawlHistory'`
- If exists, parse and populate crawl history
- If not, start with empty array
- Happens once on mount

### 2. **Auto-Save to localStorage**

```typescript
// Save history to localStorage whenever it changes
useEffect(() => {
  try {
    localStorage.setItem('crawlHistory', JSON.stringify(crawlHistory));
  } catch (err) {
    console.error('Failed to save crawl history to localStorage:', err);
  }
}, [crawlHistory]);
```

**What happens:**

- Whenever `crawlHistory` state changes, save to localStorage
- JSON stringified for persistence
- Happens on every state update
- Automatic synchronization

### 3. **Real-Time Updates During Polling**

```typescript
// Update history entry with new status (during polling)
setCrawlHistory(prev =>
  prev.map(job =>
    job.jobId === currentJobId
      ? {
          ...job,
          status: status.status,
          pagesDiscovered: status.unique_urls_discovered || 0,
        }
      : job,
  ),
);
```

**What happens:**

- Every 2 seconds, history is updated with latest job status
- Pages discovered count updates in real-time
- localStorage automatically synced
- When complete, final page count saved

### 4. **Manual History Clearing**

```typescript
const handleClearHistory = () => {
  if (window.confirm('Are you sure you want to clear all crawl history?')) {
    setCrawlHistory([]);
    setSuccessMessage('✓ Crawl history cleared');
  }
};
```

**What happens:**

- Click "Clear History" button in History tab
- Confirmation dialog prevents accidental deletion
- localStorage automatically cleared when state updates

## Data Structure

Each crawl job stored in history:

```typescript
interface CrawlJob {
  jobId: string; // Unique job identifier
  url: string; // Target URL crawled
  status: string; // Job status (pending, running, completed, failed, stopped, paused)
  createdAt: Date; // When crawl was started
  pagesDiscovered: number; // Total unique URLs discovered
  pagesCrawled: number; // Total pages successfully crawled
}
```

## localStorage Key Details

| Property        | Value                                          |
| --------------- | ---------------------------------------------- |
| **Key**         | `'crawlHistory'`                               |
| **Storage**     | Browser localStorage                           |
| **Capacity**    | ~5-10 MB per domain (varies by browser)        |
| **Persistence** | Until manually cleared or localStorage cleared |
| **Scope**       | Per-domain (localhost:3000)                    |

## Browser Support

✅ **All modern browsers support localStorage:**

- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers

## Limits & Considerations

### Storage Limits

- Most browsers allow ~5-10 MB per domain
- Each crawl job ~200-300 bytes
- Can store **thousands** of crawl history entries

### When History is Lost

History is lost if:

1. User manually clears browser cache/localStorage
2. User clicks "Clear History" button in app
3. User has browser set to clear cache on exit
4. Browser privacy mode (some browsers don't persist)

### Maximum Age

There's **no automatic expiration**. History persists until:

- Manually deleted
- Browser cache cleared
- Hard reset of browser data

## Testing the Feature

### Test 1: Basic Persistence

1. Start a crawl
2. Navigate to Dashboard
3. Navigate back to Crawl page
4. **Expected:** History should still be visible

### Test 2: Multiple Crawls

1. Start multiple crawls
2. Let them complete
3. Navigate away and back
4. **Expected:** All crawls visible in order (newest first)

### Test 3: Status Updates

1. Start a long-running crawl
2. Navigate to Dashboard (don't wait for completion)
3. Navigate back to Crawl page
4. **Expected:** Crawl history shows live status updates

### Test 4: Page Reload

1. Start a crawl
2. Press F5 or Cmd+R to reload page
3. **Expected:** Crawl history persists
4. **Expected:** Current job continues polling

### Test 5: Clear History

1. Have multiple crawls in history
2. Click "Clear History" button
3. Confirm deletion
4. Navigate away and back
5. **Expected:** History is gone

## Developer Notes

### Accessing localStorage Directly (DevTools)

```javascript
// View current history in browser console
console.log(JSON.parse(localStorage.getItem('crawlHistory') || '[]'));

// Manually clear
localStorage.removeItem('crawlHistory');

// Export as JSON
copy(localStorage.getItem('crawlHistory'));
```

### Storage Space Monitoring

```javascript
// Check how much localStorage is used
let total = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    total += localStorage[key].length;
  }
}
console.log(`Total storage: ${(total / 1024).toFixed(2)} KB`);
```

## Future Enhancements

Potential improvements:

1. **Export History:** Button to download all history as JSON
2. **Filter/Search:** Search history by URL or date
3. **Local DB:** Use IndexedDB for larger storage (50+ MB)
4. **Auto-Cleanup:** Delete history older than 30 days
5. **Sync:** Sync history across devices (requires backend)
6. **Restore:** Recover deleted history from trash

## Troubleshooting

### Issue: History Not Persisting

**Solution:** Check if localStorage is enabled

```javascript
// Test in browser console
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage works');
} catch (e) {
  console.error('localStorage not available');
}
```

### Issue: Private/Incognito Mode

Some browsers don't persist localStorage in private mode
**Solution:** Ask user to use normal mode for persistence

### Issue: Storage Full

If browser localStorage is full, new entries won't be saved
**Solution:** Clear old history entries or use IndexedDB

## Code Changes Summary

**Files Modified:**

- `src/pages/NewCrawlPage.tsx`

**Changes:**

1. Added localStorage load effect (on mount)
2. Added localStorage save effect (on state change)
3. Updated polling effect to update history entries
4. Added `handleClearHistory()` function
5. Added Clear History button to History tab UI

**Lines Changed:** ~80 lines added/modified

**Breaking Changes:** None - fully backward compatible
