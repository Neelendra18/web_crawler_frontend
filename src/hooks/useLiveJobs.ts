import { useState, useEffect, useCallback } from 'react';

interface CrawlJob {
  jobId: string;
  url: string;
  status: string;
  createdAt: Date;
  completedAt?: Date;
  pagesDiscovered: number;
  pagesCrawled: number;
}

interface LiveJob {
  jobId: string;
  jobName: string;
  jobUrl: string;
  status: string;
  progress: number;
  details: string;
  icon: string;
  action: string;
}

export const useLiveJobs = () => {
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<LiveJob[]>([]);
  const [rawJobs, setRawJobs] = useState<CrawlJob[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All status');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformJobs = (crawlHistory: CrawlJob[]): LiveJob[] => {
    if (!crawlHistory || crawlHistory.length === 0) return [];

    return crawlHistory.map(job => {
      const createdAt = new Date(job.createdAt);
      const now = new Date();
      const elapsedMs = now.getTime() - createdAt.getTime();
      const elapsedMins = Math.floor(elapsedMs / 60000);

      const progress =
        job.status === 'running'
          ? Math.min(90, Math.floor((job.pagesCrawled / Math.max(job.pagesDiscovered, 1)) * 100))
          : job.status === 'completed'
            ? 100
            : job.status === 'failed'
              ? Math.floor((job.pagesCrawled / Math.max(job.pagesDiscovered, 1)) * 100)
              : 0;

      const getIcon = (status: string) => {
        switch (status) {
          case 'running':
            return '🌐';
          case 'completed':
            return '✓';
          case 'failed':
            return '⚠️';
          case 'paused':
            return '⏸';
          default:
            return '⏳';
        }
      };

      const getDetails = () => {
        if (job.status === 'completed') {
          return `${job.pagesCrawled} pages · ${elapsedMins}m`;
        } else if (job.status === 'running') {
          return `${progress}% · ${job.pagesCrawled}/${job.pagesDiscovered} pages`;
        } else if (job.status === 'failed') {
          return `Failed at ${progress}% · ${job.pagesCrawled} pages`;
        } else if (job.status === 'paused') {
          return `Paused · ${job.pagesCrawled}/${job.pagesDiscovered} pages`;
        }
        return 'Pending...';
      };

      const getAction = (status: string) => {
        switch (status) {
          case 'running':
            return 'Pause';
          case 'paused':
            return 'Resume';
          case 'completed':
            return 'View →';
          case 'failed':
            return 'Retry';
          default:
            return 'Cancel';
        }
      };

      return {
        jobId: job.jobId,
        jobName: `Crawl - ${new URL(job.url).hostname}`,
        jobUrl: job.url,
        status: job.status,
        progress,
        details: getDetails(),
        icon: getIcon(job.status),
        action: getAction(job.status),
      };
    });
  };

  const fetchLiveJobs = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      const savedHistory = localStorage.getItem('crawlHistory');
      const crawlHistory = savedHistory ? JSON.parse(savedHistory) : [];

      const transformed = transformJobs(crawlHistory);
      setRawJobs(crawlHistory);
      setJobs(transformed);
      applyFilter(transformed, selectedFilter);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load jobs';
      setError(errorMessage);
      console.error('Error loading live jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter]);

  const applyFilter = (jobList: LiveJob[], filter: string) => {
    if (filter === 'All status') {
      setFilteredJobs(jobList);
    } else {
      setFilteredJobs(jobList.filter(job => job.status.toLowerCase() === filter.toLowerCase()));
    }
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    applyFilter(jobs, filter);
  };

  // Load data on mount
  useEffect(() => {
    fetchLiveJobs();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'crawlHistory') {
        fetchLiveJobs();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchLiveJobs]);

  return {
    jobs: filteredJobs,
    allJobs: jobs,
    rawJobs,
    selectedFilter,
    handleFilterChange,
    loading,
    error,
    refetch: fetchLiveJobs,
  };
};

export default useLiveJobs;
