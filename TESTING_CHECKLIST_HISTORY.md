# Crawl History Persistence - Testing Checklist

## 🧪 Test Scenarios

### Test 1: Basic Persistence ✅

**Objective:** Verify history survives page navigation

**Steps:**

- [ ] Start a crawl of any URL (e.g., https://example.com)
- [ ] Wait for it to show up in History tab
- [ ] Click "Dashboard" or navigate away
- [ ] Navigate back to Crawl page
- [ ] **VERIFY:** Crawl history still visible

**Expected Result:** ✅ History preserved

---

### Test 2: Multiple Crawls ✅

**Objective:** Verify multiple crawls are tracked correctly

**Steps:**

- [ ] Start crawl #1: https://example.com (depth: 1)
- [ ] Wait for visible update in History
- [ ] Start crawl #2: https://another-site.com (depth: 2)
- [ ] Wait for visible update in History
- [ ] Navigate to Dashboard
- [ ] Navigate back to Crawl page
- [ ] **VERIFY:** Both crawls appear in history (newest first)

**Expected Result:** ✅ All crawls preserved in order

---

### Test 3: Real-Time Status Updates 📊

**Objective:** Verify history updates with live status

**Steps:**

- [ ] Start a crawl (ideally one that takes 10+ seconds)
- [ ] Watch History tab - note initial status
- [ ] Navigate to Dashboard (don't wait for completion)
- [ ] Switch to different page
- [ ] **Wait 5 seconds**
- [ ] Navigate back to Crawl page
- [ ] **VERIFY:** Crawl status has updated in History tab
- [ ] Pages Discovered count increased
- [ ] Status shows current state (pending, running, completed, etc)

**Expected Result:** ✅ History reflects real-time updates

---

### Test 4: Page Reload 🔄

**Objective:** Verify localStorage works across page reloads

**Steps:**

- [ ] Start a crawl
- [ ] Let it progress 10-20% (1-2 polling cycles)
- [ ] Press F5 or Cmd+R to reload page
- [ ] **VERIFY:** Crawl history still visible
- [ ] **VERIFY:** Crawl continues polling (live updates resume)
- [ ] **VERIFY:** Status updates continue after reload

**Expected Result:** ✅ History and job state fully preserved

---

### Test 5: Browser Refresh Persistence 🌐

**Objective:** Verify history persists across hard refreshes

**Steps:**

- [ ] Manually create 3 test crawls
- [ ] Let them reach "completed" status
- [ ] Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- [ ] **VERIFY:** All 3 crawls still in history

**Expected Result:** ✅ Hard refresh doesn't lose data

---

### Test 6: Clear History Button ❌

**Objective:** Verify manual clearing works

**Steps:**

- [ ] Create 2-3 crawl entries in history
- [ ] Click "History" tab
- [ ] **VERIFY:** Red "Clear History" button appears
- [ ] Click "Clear History"
- [ ] **VERIFY:** Confirmation dialog appears
- [ ] Click "Cancel" in dialog
- [ ] **VERIFY:** History NOT cleared
- [ ] Click "Clear History" again
- [ ] Click "OK" in dialog
- [ ] **VERIFY:** All history removed
- [ ] **VERIFY:** Notification shows "✓ Crawl history cleared"

**Expected Result:** ✅ Manual clearing works with confirmation

---

### Test 7: Clear History Persistence ✅

**Objective:** Verify cleared history stays cleared

**Steps:**

- [ ] Clear history (from Test 6)
- [ ] Navigate to Dashboard
- [ ] Navigate back to Crawl page
- [ ] **VERIFY:** History is still empty
- [ ] **VERIFY:** "No crawl history yet..." message shows

**Expected Result:** ✅ Cleared state persists

---

### Test 8: Mixed Status Updates 📈

**Objective:** Verify different job statuses tracked correctly

**Steps:**

- [ ] Start crawl #1
- [ ] While running, start crawl #2
- [ ] Pause crawl #1
- [ ] While paused, let crawl #2 complete
- [ ] Check History tab
- [ ] **VERIFY:** Crawl #1 shows "paused" status
- [ ] **VERIFY:** Crawl #2 shows "completed" status
- [ ] Resume crawl #1
- [ ] **VERIFY:** History updates to "running" for crawl #1

**Expected Result:** ✅ All statuses correctly tracked

---

### Test 9: Long History List 📜

**Objective:** Verify performance with many history entries

**Steps:**

- [ ] Open DevTools Console
- [ ] Create 20 mock entries:

```javascript
const mock = [];
for (let i = 0; i < 20; i++) {
  mock.push({
    jobId: `job-${i}`,
    url: `https://site-${i}.com`,
    status: ['pending', 'running', 'completed', 'failed'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - i * 3600000),
    pagesDiscovered: Math.floor(Math.random() * 500),
    pagesCrawled: Math.floor(Math.random() * 400),
  });
}
localStorage.setItem('crawlHistory', JSON.stringify(mock));
```

- [ ] Reload page
- [ ] Check History tab
- [ ] **VERIFY:** All 20 entries load
- [ ] **VERIFY:** No performance issues
- [ ] Scroll through list
- [ ] **VERIFY:** Smooth scrolling

**Expected Result:** ✅ Handles large history gracefully

---

### Test 10: Browser DevTools Inspection 🔧

**Objective:** Verify localStorage contents are correct

**Steps:**

- [ ] Create 2-3 crawls
- [ ] Open DevTools (F12)
- [ ] Go to Storage → Local Storage → localhost:3000
- [ ] Find "crawlHistory" key
- [ ] **VERIFY:** JSON is valid
- [ ] **VERIFY:** Contains all crawls
- [ ] **VERIFY:** Has correct structure:
  - jobId, url, status, createdAt, pagesDiscovered, pagesCrawled

**Expected Result:** ✅ Valid JSON in localStorage

---

## 📋 Completion Checklist

- [ ] All 10 tests passed
- [ ] No console errors during any test
- [ ] No 404 or network errors
- [ ] History tab displays correctly
- [ ] Clear History button works
- [ ] No TypeScript compilation errors
- [ ] No ESLint warnings

## 🐛 Known Issues (if any)

_Document any issues found during testing:_

1. Issue: _[description]_
   - Affected tests: _[which tests]_
   - Severity: _[critical/high/medium/low]_
   - Status: _[open/fixed/investigating]_

## ✅ Sign-off

**Tested By:** ********\_\_\_\_********
**Date:** ********\_\_\_\_********
**Result:** ☐ PASS ☐ FAIL

**Notes:**
