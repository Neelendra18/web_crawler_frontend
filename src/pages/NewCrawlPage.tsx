import React, { useState, useRef, useEffect } from 'react';
import { crawlerService } from '@services/crawlerService';
import { CrawlStartRequest, CrawlResultsResponse, CrawlStatusResponse } from '@app-types/index';
import './CrawlerPage.css';

interface CrawlJob {
  jobId: string;
  url: string;
  status: string;
  createdAt: Date;
  pagesDiscovered: number;
  pagesCrawled: number;
}

const tips = [
  '🔗 Provide the exact URL you want to crawl',
  '📊 Crawl depth determines how many link levels to follow (1-10)',
  '⚡ Depth 1-2: Shallow crawl, fast and efficient',
  '⚡ Depth 3-5: Standard crawl, balanced coverage',
  '⚡ Depth 6+: Deep crawl, comprehensive but slower',
  '🔒 Excluded URLs help skip logout, admin, or API paths',
];

const CrawlPage: React.FC = () => {
  const [section, setSection] = useState<'new' | 'history'>('new');

  // Form state
  const [url, setUrl] = useState('');
  const [maxDepth, setMaxDepth] = useState(2);
  const [excludedUrls, setExcludedUrls] = useState('');

  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Job state
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<CrawlStatusResponse | null>(null);
  const [crawlResults, setCrawlResults] = useState<CrawlResultsResponse | null>(null);
  const [crawlHistory, setCrawlHistory] = useState<CrawlJob[]>([]);

  // Polling
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('crawlHistory', JSON.stringify(crawlHistory));
    } catch (err) {
      console.error('Failed to save crawl history to localStorage:', err);
    }
  }, [crawlHistory]);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Poll for status updates when job is running
  useEffect(() => {
    if (
      !currentJobId ||
      !jobStatus ||
      jobStatus.status === 'completed' ||
      jobStatus.status === 'failed'
    ) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    const pollStatus = async () => {
      try {
        const status = await crawlerService.getCrawlStatus(currentJobId);
        setJobStatus(status);

        // Update history entry with new status
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

        // If completed, fetch results
        if (status.status === 'completed') {
          const results = await crawlerService.getCrawlResults(currentJobId);
          setCrawlResults(results);
          setSuccessMessage(`✓ Crawl completed! Found ${results.pages.length} pages.`);

          // Update history with final page count
          setCrawlHistory(prev =>
            prev.map(job =>
              job.jobId === currentJobId
                ? {
                    ...job,
                    status: 'completed',
                    pagesCrawled: results.pages.length,
                  }
                : job,
            ),
          );
        }
      } catch (err) {
        // Silent fail on poll, don't interrupt user experience
        console.error('Error polling status:', err);
      }
    };

    // Poll every 2 seconds
    pollIntervalRef.current = setInterval(pollStatus, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [currentJobId, jobStatus]);

  const validateUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleStartCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Invalid URL format. Use https://example.com');
      return;
    }

    if (maxDepth < 1 || maxDepth > 10) {
      setError('Crawl depth must be between 1 and 10');
      return;
    }

    setIsLoading(true);

    try {
      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      const request: CrawlStartRequest = {
        base_url: url,
        max_depth: maxDepth,
        excluded_urls: excludedUrls.trim() || undefined,
      };

      const response = await crawlerService.startCrawl(request, {
        signal: abortControllerRef.current.signal,
      });

      setCurrentJobId(response.job_id);
      setJobStatus({
        job_id: response.job_id,
        status: 'pending',
        unique_urls_discovered: 0,
      });

      // Add to history
      setCrawlHistory(prev => [
        {
          jobId: response.job_id,
          url,
          status: 'pending',
          createdAt: new Date(),
          pagesDiscovered: 0,
          pagesCrawled: 0,
        },
        ...prev,
      ]);

      setSuccessMessage('✓ Crawl job started!');
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start crawl';
      setError(errorMsg);
      setCurrentJobId(null);
      setJobStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopCrawl = async () => {
    if (!currentJobId) return;

    setIsLoading(true);
    try {
      await crawlerService.stopCrawl(currentJobId);
      setJobStatus(prev => (prev ? { ...prev, status: 'stopped' } : null));
      setSuccessMessage('✓ Crawl stopped');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to stop crawl';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseCrawl = async () => {
    if (!currentJobId) return;

    setIsLoading(true);
    try {
      await crawlerService.pauseCrawl(currentJobId);
      setJobStatus(prev => (prev ? { ...prev, status: 'paused' } : null));
      setSuccessMessage('✓ Crawl paused');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to pause crawl';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeCrawl = async () => {
    if (!currentJobId) return;

    setIsLoading(true);
    try {
      await crawlerService.resumeCrawl(currentJobId);
      setJobStatus(prev => (prev ? { ...prev, status: 'running' } : null));
      setSuccessMessage('✓ Crawl resumed');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to resume crawl';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCrawl = async () => {
    if (!currentJobId) return;

    try {
      const blob = await crawlerService.exportCrawl(currentJobId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `crawl-${currentJobId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to export crawl';
      setError(errorMsg);
    }
  };

  const handleClearHistory = () => {
    if (
      window.confirm('Are you sure you want to clear all crawl history? This cannot be undone.')
    ) {
      setCrawlHistory([]);
      setSuccessMessage('✓ Crawl history cleared');
    }
  };

  const statusColorMap: Record<string, string> = {
    pending: '#f59e0b',
    running: '#3b82f6',
    completed: '#10b981',
    stopped: '#ef4444',
    failed: '#ef4444',
    paused: '#f97316',
    revoked: '#ef4444',
  };

  return (
    <div style={{ padding: 32 }}>
      {/* Page Heading */}
      <div className="section-header" style={{ marginBottom: 32 }}>
        <div className="section-title">Crawl</div>
        <div className="section-line" />
      </div>

      {/* Two-column layout */}
      <div
        className="crawl-page-2col"
        style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}
      >
        {/* Main Section */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button
              className={`btn${section === 'new' ? ' btn-primary' : ''}`}
              onClick={() => setSection('new')}
            >
              New Crawl
            </button>
            <button
              className={`btn${section === 'history' ? ' btn-primary' : ''}`}
              onClick={() => setSection('history')}
            >
              History ({crawlHistory.length})
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: 16,
                marginBottom: 16,
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: 6,
                color: '#b91c1c',
                fontSize: 14,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div
              style={{
                padding: 16,
                marginBottom: 16,
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: 6,
                color: '#15803d',
                fontSize: 14,
              }}
            >
              {successMessage}
            </div>
          )}

          {section === 'new' && (
            <div className="card" style={{ padding: 32, marginBottom: 32 }}>
              <form onSubmit={handleStartCrawl}>
                {/* URL Input */}
                <div className="input-group" style={{ marginBottom: 18 }}>
                  <div className="input-label">Target URL *</div>
                  <input
                    className="input-field"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    disabled={
                      isLoading ||
                      jobStatus?.status === 'running' ||
                      jobStatus?.status === 'pending'
                    }
                    autoComplete="off"
                  />
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                    Enter the website URL you want to crawl
                  </div>
                </div>

                {/* Crawl Depth */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                    marginBottom: 18,
                  }}
                >
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <div className="input-label">Crawl Depth *</div>
                    <select
                      className="input-field"
                      value={maxDepth}
                      onChange={e => setMaxDepth(parseInt(e.target.value))}
                      disabled={
                        isLoading ||
                        jobStatus?.status === 'running' ||
                        jobStatus?.status === 'pending'
                      }
                    >
                      <option value={1}>1 — Shallow</option>
                      <option value={2}>2 — Standard</option>
                      <option value={3}>3 — Medium</option>
                      <option value={5}>5 — Deep</option>
                      <option value={10}>10 — Very Deep</option>
                    </select>
                  </div>

                  {/* Max Depth Info */}
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                      {maxDepth === 1 && '🚀 Fastest, single page + immediate links'}
                      {maxDepth === 2 && '⚡ Recommended, good balance'}
                      {maxDepth >= 3 && maxDepth <= 5 && '🔍 Thorough, more pages crawled'}
                      {maxDepth >= 10 && '🐢 Comprehensive, will take longer'}
                    </div>
                  </div>
                </div>

                {/* Excluded URLs */}
                <div className="input-group" style={{ marginBottom: 18 }}>
                  <div className="input-label">Excluded URLs (optional)</div>
                  <textarea
                    className="input-field"
                    placeholder="/logout, /admin/*, /api/v*, /search?*"
                    value={excludedUrls}
                    onChange={e => setExcludedUrls(e.target.value)}
                    disabled={
                      isLoading ||
                      jobStatus?.status === 'running' ||
                      jobStatus?.status === 'pending'
                    }
                    style={{ minHeight: 60, fontFamily: 'monospace', fontSize: 12 }}
                  />
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                    Comma-separated patterns to skip. Examples: /logout, /admin/*, /api/v*,
                    /search?*
                  </div>
                </div>

                {/* Button Group */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      isLoading ||
                      jobStatus?.status === 'running' ||
                      jobStatus?.status === 'pending'
                    }
                    style={{
                      opacity:
                        isLoading ||
                        jobStatus?.status === 'running' ||
                        jobStatus?.status === 'pending'
                          ? 0.6
                          : 1,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isLoading ? 'Starting...' : 'Start Crawl'}
                  </button>

                  {jobStatus &&
                    (jobStatus.status === 'running' || jobStatus.status === 'pending') && (
                      <>
                        <button
                          type="button"
                          className="btn"
                          onClick={handlePauseCrawl}
                          disabled={isLoading}
                        >
                          Pause
                        </button>
                        <button
                          type="button"
                          className="btn"
                          onClick={handleStopCrawl}
                          disabled={isLoading}
                          style={{ color: '#ef4444' }}
                        >
                          Stop
                        </button>
                      </>
                    )}

                  {jobStatus && jobStatus.status === 'paused' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleResumeCrawl}
                      disabled={isLoading}
                    >
                      Resume
                    </button>
                  )}

                  {jobStatus && jobStatus.status === 'completed' && (
                    <button
                      type="button"
                      className="btn"
                      onClick={handleExportCrawl}
                      disabled={isLoading}
                    >
                      📥 Export Results
                    </button>
                  )}
                </div>
              </form>

              {/* Job Status Display */}
              {jobStatus && (
                <div
                  style={{
                    marginTop: 32,
                    paddingTop: 32,
                    borderTop: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          padding: '4px 12px',
                          backgroundColor: statusColorMap[jobStatus.status] || '#6b7280',
                          color: 'white',
                          borderRadius: 4,
                          textTransform: 'capitalize',
                        }}
                      >
                        {jobStatus.status}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                        Job ID:{' '}
                        <code style={{ fontSize: 11 }}>{jobStatus.job_id.substring(0, 8)}...</code>
                      </div>
                    </div>

                    {/* Status Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div
                        style={{
                          padding: 12,
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: 6,
                        }}
                      >
                        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                          URLs Discovered
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>
                          {jobStatus.unique_urls_discovered}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: 12,
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: 6,
                        }}
                      >
                        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Pages Crawled</div>
                        <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>
                          {crawlResults?.pages.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Display */}
                  {crawlResults && crawlResults.pages.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
                        Crawled Pages:
                      </div>
                      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                        {crawlResults.pages.map((page, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: 12,
                              marginBottom: 8,
                              backgroundColor: 'var(--bg-secondary)',
                              borderRadius: 4,
                              fontSize: 12,
                              borderLeft: `3px solid ${page.status_code === 200 ? '#10b981' : '#ef4444'}`,
                            }}
                          >
                            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                              {page.title || 'Untitled'} (Depth: {page.depth})
                            </div>
                            <div
                              style={{ color: 'var(--text-dim)', marginBottom: 4 }}
                              title={page.url}
                            >
                              {new URL(page.url).pathname.substring(0, 80)}
                              {new URL(page.url).pathname.length > 80 ? '...' : ''}
                            </div>
                            <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
                              <span>Status: {page.status_code}</span>
                              <span>Links: {page.links_found}</span>
                              {page.error && (
                                <span style={{ color: '#ef4444' }}>Error: {page.error}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {section === 'history' && (
            <div className="card" style={{ padding: 32 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>Crawl History</div>
                {crawlHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    style={{
                      padding: '8px 12px',
                      fontSize: 12,
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Clear History
                  </button>
                )}
              </div>
              {crawlHistory.length === 0 ? (
                <div
                  style={{
                    fontSize: 14,
                    color: 'var(--text-dim)',
                    textAlign: 'center',
                    padding: 32,
                  }}
                >
                  No crawl history yet. Start a crawl to see it appear here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {crawlHistory.map(job => (
                    <div
                      key={job.jobId}
                      style={{
                        padding: 16,
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 6,
                        borderLeft: `3px solid ${statusColorMap[job.status]}`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 'bold' }}>{job.url}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                            {job.createdAt.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
                            Pages: {job.pagesCrawled} | URLs Found: {job.pagesDiscovered}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            backgroundColor: statusColorMap[job.status],
                            color: 'white',
                            borderRadius: 3,
                            textTransform: 'capitalize',
                          }}
                        >
                          {job.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Tips & Info */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div className="card" style={{ marginBottom: 24, padding: 24 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>
              How It Works
            </div>
            <ul
              style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.8, paddingLeft: 18 }}
            >
              {tips.map((tip, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>
              API Status
            </div>
            <div
              style={{
                padding: 12,
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                  }}
                />
                <span>Backend API Connected</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                http://localhost:8000/crawler
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrawlPage;
