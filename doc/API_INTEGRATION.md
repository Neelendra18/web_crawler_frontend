# Backend Integration Guide

This guide documents the API contract between the frontend (React) and backend (Python) for the Web Crawler application.

## API Base Configuration

**Frontend Configuration** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

**Expected Backend**: Python application running on `http://localhost:8000`

---

## API Endpoints

### 1. Start Crawl Job

**Endpoint**: `POST /api/crawl/start`

**Request**:
```json
{
  "website_url": "https://example.com",
  "auth_type": "None (Public)",
  "auth_config": {
    "login_url": "https://example.com/login",
    "reuse_session": true,
    "capture_screenshots": false
  },
  "framework": "Playwright",
  "language": "TypeScript"
}
```

**Response** (HTTP 200):
```json
{
  "id": "job_abc123xyz",
  "status": "pending",
  "progress": 0,
  "pages_crawled": 0,
  "test_cases": 0,
  "generated_files": 0,
  "tests": []
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique job identifier |
| `status` | enum | `pending`, `running`, `completed`, `failed` |
| `progress` | number | 0-100 progress percentage |
| `pages_crawled` | number | Number of pages analyzed |
| `test_cases` | number | Number of test cases generated |
| `generated_files` | number | Number of code files created |
| `tests` | array | Array of generated test objects |

**Error** (HTTP 400/500):
```json
{
  "error": "Invalid website URL",
  "message": "The provided URL is not a valid website",
  "status_code": 400
}
```

---

### 2. Get Crawl Status

**Endpoint**: `GET /api/crawl/{jobId}/status`

**Parameters**:
- `jobId` (path): Job ID from `/start` response

**Response** (HTTP 200):
```json
{
  "id": "job_abc123xyz",
  "status": "running",
  "progress": 45,
  "pages_crawled": 12,
  "test_cases": 24,
  "generated_files": 5,
  "tests": [
    {
      "id": "test_1",
      "name": "Login Form Submission",
      "description": "Tests user login functionality",
      "code": "// Test code here"
    }
  ]
}
```

**Polling Strategy** (Frontend):
- Frontend polls every **1 second** initially
- Status updates contain cumulative progress
- Returns remaining status even if job is `completed` or `failed`

---

### 3. Cancel Crawl Job

**Endpoint**: `POST /api/crawl/{jobId}/cancel`

**Parameters**:
- `jobId` (path): Job ID to cancel

**Response** (HTTP 200):
```json
{
  "success": true,
  "message": "Job cancelled successfully",
  "jobId": "job_abc123xyz"
}
```

**Note**: Frontend expects immediate response; job state updates in subsequent status polls.

---

### 4. Download Generated Tests

**Endpoint**: `GET /api/crawl/{jobId}/download`

**Parameters**:
- `jobId` (path): Completed job ID

**Response** (HTTP 200):
- **Content-Type**: `application/zip` or `application/x-tar+gzip`
- **Body**: Binary file containing generated test files
- **Headers**: 
  ```
  Content-Disposition: attachment; filename="crawl_job_abc123xyz.zip"
  ```

**Error** (HTTP 404):
```json
{
  "error": "Job not found",
  "message": "No files available for download"
}
```

---

### 5. Push to Git Repository

**Endpoint**: `POST /api/crawl/{jobId}/push-git`

**Request**:
```json
{
  "repo_url": "https://github.com/user/repo.git",
  "branch": "feature/crawler-tests",
  "commit_message": "Add automated test cases from crawler"
}
```

**Response** (HTTP 200):
```json
{
  "success": true,
  "message": "Tests pushed to git successfully",
  "commit_hash": "abc123def456",
  "branch": "feature/crawler-tests",
  "files_pushed": 5
}
```

**Error Scenarios**:
```json
{
  "success": false,
  "error": "Invalid repository URL",
  "message": "Could not authenticate with the provided repository"
}
```

---

### 6. Get Crawl History

**Endpoint**: `GET /api/crawl/history`

**Query Parameters**:
- `limit` (optional, default: 10): Number of recent jobs to return

**Response** (HTTP 200):
```json
[
  {
    "id": "job_abc123xyz",
    "website_url": "https://example.com",
    "status": "completed",
    "created_at": "2024-01-15T10:30:00Z",
    "completed_at": "2024-01-15T10:35:00Z",
    "pages_crawled": 25,
    "test_cases": 50,
    "framework": "Playwright",
    "language": "TypeScript"
  }
]
```

---

## Data Types & Enums

### Auth Types
```python
auth_type: Literal['None (Public)', 'Form Login', 'SSO / OAuth']
```

### Frameworks
```python
framework: Literal['Playwright', 'Selenium']
```

### Languages
```python
language: Literal['TypeScript', 'Python']
```

### Job Status
```python
status: Literal['pending', 'running', 'completed', 'failed']
```

### Test Case Object
```python
class TestCase:
    id: str                  # Unique identifier
    name: str               # Human-readable test name
    description: str        # What the test does
    code: str              # Generated test code
```

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input parameters |
| 404 | Not Found | Job ID doesn't exist |
| 409 | Conflict | Job already running |
| 500 | Server Error | Internal server error |
| 503 | Unavailable | Service temporarily unavailable |

### Error Response Format

```json
{
  "error": "Error code/title",
  "message": "Human-readable description",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {}  // Optional extra information
}
```

### Frontend Error Handling

The frontend will:
1. Log API errors to the activity log
2. Display user-friendly error messages in the UI
3. Retry certain failures automatically
4. Allow users to cancel and restart jobs

---

## Request/Response Headers

### Requests

```
Content-Type: application/json
Accept: application/json
Accept-Encoding: gzip, deflate
User-Agent: WebCrawlerFrontend/1.0
```

### Responses

```
Content-Type: application/json
Cache-Control: no-cache
Access-Control-Allow-Origin: http://localhost:3000  (for CORS)
```

### CORS Requirements

Backend must allow:
- **Origins**: `http://localhost:3000` (dev), production URL
- **Methods**: GET, POST
- **Headers**: Content-Type, Accept

---

## Example Flow Diagram

```
User Interface
    ↓
POST /api/crawl/start { website_url: "...", ... }
    ↓ [Response: jobId]
Display Loading UI
    ↓
[Loop every 1s] GET /api/crawl/{jobId}/status
    ↓ [Response: progress, metrics, logs]
Update UI with Progress
    ↓
[When status === "completed"]
    ↓
Allow Download: GET /api/crawl/{jobId}/download
Allow Push: POST /api/crawl/{jobId}/push-git
```

---

## Implementation Checklist for Backend

- [ ] Implement `/api/crawl/start` endpoint
- [ ] Implement `/api/crawl/{jobId}/status` endpoint
- [ ] Implement `/api/crawl/{jobId}/cancel` endpoint
- [ ] Implement `/api/crawl/{jobId}/download` endpoint
- [ ] Implement `/api/crawl/{jobId}/push-git` endpoint
- [ ] Implement `/api/crawl/history` endpoint
- [ ] Configure CORS for frontend origin
- [ ] Implement proper error responses
- [ ] Add request validation
- [ ] Add logging for debugging
- [ ] Handle concurrent requests properly
- [ ] Test with frontend application

---

## Testing the API

### Using cURL

```bash
# Start a crawl
curl -X POST http://localhost:8000/api/crawl/start \
  -H "Content-Type: application/json" \
  -d '{
    "website_url": "https://example.com",
    "auth_type": "None (Public)",
    "framework": "Playwright",
    "language": "TypeScript"
  }'

# Check status
curl http://localhost:8000/api/crawl/job_abc123xyz/status

# Cancel job
curl -X POST http://localhost:8000/api/crawl/job_abc123xyz/cancel

# Download files
curl http://localhost:8000/api/crawl/job_abc123xyz/download -o tests.zip
```

### Using Python Requests

```python
import requests
import json

BASE_URL = "http://localhost:8000"

# Start crawl
response = requests.post(
    f"{BASE_URL}/api/crawl/start",
    json={
        "website_url": "https://example.com",
        "auth_type": "None (Public)",
        "framework": "Playwright",
        "language": "TypeScript"
    }
)

job_id = response.json()["id"]
print(f"Job ID: {job_id}")

# Poll status
import time
while True:
    status = requests.get(f"{BASE_URL}/api/crawl/{job_id}/status").json()
    print(f"Status: {status['status']}, Progress: {status['progress']}%")
    
    if status['status'] in ['completed', 'failed']:
        break
    
    time.sleep(1)
```

---

## Performance Considerations

### Polling
- Frontend polls every **1 second** for status updates
- Backend should respond quickly (< 100ms ideally)
- Status endpoint should query current job state efficiently

### Download
- Large test files (100+ tests) → provide as zip/tar
- Compress files before sending
- Resume support recommended for large files

### History
- Limit results to prevent memory issues
- Index by date/status for faster queries
- Consider pagination for large result sets

---

## Future Enhancements

- [ ] WebSocket support for real-time updates (instead of polling)
- [ ] Batch operations for multiple crawls
- [ ] Test execution endpoints
- [ ] Result comparison between versions
- [ ] Custom test template support

---

## Support & Questions

For API integration questions:
1. Review this documentation
2. Check example requests/responses
3. Test endpoints with cURL first
4. Contact the frontend development team

---

**Last Updated**: 2024
**API Version**: 1.0
**Frontend Version**: 1.0.0
