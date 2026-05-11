import { useState, useEffect, useCallback } from 'react';

interface CrawlJob {
  jobId: string;
  url: string;
  status: string;
  createdAt: Date;
  pagesDiscovered: number;
  pagesCrawled: number;
}

interface DashboardStats {
  totalCrawls: number;
  testCasesGenerated: number;
  failedRuns: number;
  cicdExecutions: number;
  activeCrawlJobs: Array<{
    jobId: string;
    jobName: string;
    baseUrl: string;
    status: string;
    progress: number;
    startTime: string;
  }>;
  testRunStats: {
    passRate: number;
    passed: number;
    failed: number;
    skipped: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCrawls: 0,
    testCasesGenerated: 0,
    failedRuns: 0,
    cicdExecutions: 0,
    activeCrawlJobs: [],
    testRunStats: {
      passRate: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
    },
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = (crawlHistory: CrawlJob[]) => {
    if (!crawlHistory || crawlHistory.length === 0) {
      return {
        totalCrawls: 0,
        testCasesGenerated: 0,
        failedRuns: 0,
        cicdExecutions: 0,
        activeCrawlJobs: [],
        testRunStats: {
          passRate: 0,
          passed: 0,
          failed: 0,
          skipped: 0,
        },
        recentActivity: [],
      };
    }

    // Calculate basic stats
    const totalCrawls = crawlHistory.length;
    const failedRuns = crawlHistory.filter(job => job.status === 'failed').length;
    const testCasesGenerated = crawlHistory.reduce((sum, job) => sum + (job.pagesCrawled || 0), 0);
    const cicdExecutions = totalCrawls;

    // Get active jobs (running or pending)
    const activeCrawlJobs = crawlHistory
      .filter(job => job.status === 'running' || job.status === 'pending')
      .slice(0, 5)
      .map(job => {
        const createdAt = new Date(job.createdAt);
        const progress = job.status === 'running' ? 45 : 0; // Mock progress

        return {
          jobId: job.jobId,
          jobName: `Crawl - ${new URL(job.url).hostname}`,
          baseUrl: job.url,
          status: job.status,
          progress,
          startTime: createdAt.toLocaleTimeString(),
        };
      });

    // Calculate test run stats (from completed jobs)
    const completedJobs = crawlHistory.filter(job => job.status === 'completed');
    const passed = completedJobs.length;
    const skipped = crawlHistory.filter(job => job.status === 'paused').length;
    const failed = failedRuns;
    const total = passed + failed + skipped;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    // Create activity log (recent events)
    const recentActivity = crawlHistory
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((job, idx) => {
        const createdAt = new Date(job.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        let timeAgo = '';
        if (diffMins < 1) {
          timeAgo = 'just now';
        } else if (diffMins < 60) {
          timeAgo = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
          timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
          timeAgo = createdAt.toLocaleDateString();
        }

        const statusMessage =
          {
            running: 'Crawl in progress',
            completed: 'Crawl completed successfully',
            failed: 'Crawl failed',
            paused: 'Crawl paused',
            pending: 'Crawl pending',
          }[job.status] || 'Crawl status updated';

        return {
          id: `${job.jobId}-${idx}`,
          type: 'crawl',
          description: `${statusMessage} - ${new URL(job.url).hostname}`,
          timestamp: timeAgo,
          status: job.status,
        };
      });

    return {
      totalCrawls,
      testCasesGenerated,
      failedRuns,
      cicdExecutions,
      activeCrawlJobs,
      testRunStats: {
        passRate,
        passed,
        failed,
        skipped,
      },
      recentActivity,
    };
  };

  const fetchDashboardData = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      // Load crawl history from localStorage
      const savedHistory = localStorage.getItem('crawlHistory');
      const crawlHistory = savedHistory ? JSON.parse(savedHistory) : [];

      // Calculate stats from history
      const calculatedStats = calculateStats(crawlHistory);
      setStats(calculatedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchDashboardData();

    // Set up polling - refresh every 30 seconds
    const pollInterval = setInterval(fetchDashboardData, 30000);

    // Also listen for storage changes (when crawl completes on another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'crawlHistory') {
        fetchDashboardData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchDashboardData]);

  return { stats, loading, error, refetch: fetchDashboardData };
};

export default useDashboardData;
