import { apiClient } from './apiClient';
import {
  CrawlStartRequest,
  CrawlStartResponse,
  CrawlStatusResponse,
  CrawlResultsResponse,
  CrawlUrlsResponse,
  CrawlSitemapResponse,
  ProcessedPageResponse,
  CrawlStopResponse,
  CrawlDeleteResponse,
  CrawlDeletePageResponse,
} from '@app-types/index';

interface RequestOptions {
  signal?: AbortSignal;
}

/**
 * Crawler Service
 * Provides methods to interact with the backend crawler API
 * Base path: /crawler
 */
export const crawlerService = {
  /**
   * Start a new crawl job
   * POST /crawler/start
   */
  async startCrawl(
    request: CrawlStartRequest,
    options?: RequestOptions,
  ): Promise<CrawlStartResponse> {
    try {
      const response = await apiClient.post<CrawlStartResponse>('/crawler/start', request, {
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to start crawl');
    }
  },

  /**
   * Get the status of a crawl job
   * GET /crawler/{job_id}/status
   */
  async getCrawlStatus(jobId: string, options?: RequestOptions): Promise<CrawlStatusResponse> {
    try {
      const response = await apiClient.get<CrawlStatusResponse>(`/crawler/${jobId}/status`, {
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get crawl status');
    }
  },

  /**
   * Get crawl results with all crawled pages
   * GET /crawler/{job_id}/results
   */
  async getCrawlResults(jobId: string, options?: RequestOptions): Promise<CrawlResultsResponse> {
    try {
      const response = await apiClient.get<CrawlResultsResponse>(`/crawler/${jobId}/results`, {
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get crawl results');
    }
  },

  /**
   * Get list of all crawled URLs
   * GET /crawler/{job_id}/urls
   */
  async getCrawledUrls(jobId: string, options?: RequestOptions): Promise<CrawlUrlsResponse> {
    try {
      const response = await apiClient.get<CrawlUrlsResponse>(`/crawler/${jobId}/urls`, {
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get crawled URLs');
    }
  },

  /**
   * Get site structure and summary (sitemap)
   * GET /crawler/{job_id}/sitemap
   */
  async getSitemap(jobId: string, options?: RequestOptions): Promise<CrawlSitemapResponse> {
    try {
      const response = await apiClient.get<CrawlSitemapResponse>(`/crawler/${jobId}/sitemap`, {
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get sitemap');
    }
  },

  /**
   * Get processed page data (LLM-ready format)
   * GET /crawler/{job_id}/page/processed?page_id={page_id}
   */
  async getProcessedPage(
    jobId: string,
    pageId: string,
    options?: RequestOptions,
  ): Promise<ProcessedPageResponse> {
    try {
      const response = await apiClient.get<ProcessedPageResponse>(
        `/crawler/${jobId}/page/processed`,
        {
          params: { page_id: pageId },
          signal: options?.signal,
        },
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get processed page');
    }
  },

  /**
   * Get raw HTML of a page
   * GET /crawler/{job_id}/page/raw?url={url}
   */
  async getPageRaw(
    jobId: string,
    url: string,
    options?: RequestOptions,
  ): Promise<{ url: string; html: string; status_code: number }> {
    try {
      const response = await apiClient.get<{
        url: string;
        html: string;
        status_code: number;
      }>(`/crawler/${jobId}/page/raw`, {
        params: { url },
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get page raw HTML');
    }
  },

  /**
   * Get page as markdown
   * GET /crawler/{job_id}/page/markdown?url={url}
   */
  async getPageMarkdown(jobId: string, url: string, options?: RequestOptions): Promise<string> {
    try {
      const response = await apiClient.get<string>(`/crawler/${jobId}/page/markdown`, {
        params: { url },
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get page markdown');
    }
  },

  /**
   * Stop a running crawl job
   * POST /crawler/{job_id}/stop
   */
  async stopCrawl(jobId: string, options?: RequestOptions): Promise<CrawlStopResponse> {
    try {
      const response = await apiClient.post<CrawlStopResponse>(
        `/crawler/${jobId}/stop`,
        {},
        { signal: options?.signal },
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to stop crawl');
    }
  },

  /**
   * Pause a running crawl job
   * POST /crawler/{job_id}/pause
   */
  async pauseCrawl(jobId: string, options?: RequestOptions): Promise<CrawlStopResponse> {
    try {
      const response = await apiClient.post<CrawlStopResponse>(
        `/crawler/${jobId}/pause`,
        {},
        { signal: options?.signal },
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to pause crawl');
    }
  },

  /**
   * Resume a paused crawl job
   * POST /crawler/{job_id}/resume
   */
  async resumeCrawl(jobId: string, options?: RequestOptions): Promise<CrawlStopResponse> {
    try {
      const response = await apiClient.post<CrawlStopResponse>(
        `/crawler/${jobId}/resume`,
        {},
        { signal: options?.signal },
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to resume crawl');
    }
  },

  /**
   * Export crawl data as ZIP file
   * GET /crawler/{job_id}/export
   */
  async exportCrawl(jobId: string, options?: RequestOptions): Promise<Blob> {
    try {
      const response = await apiClient.get(`/crawler/${jobId}/export`, {
        responseType: 'blob',
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to export crawl');
    }
  },

  /**
   * Delete a crawl job and all associated data
   * DELETE /crawler/{job_id}
   */
  async deleteCrawl(jobId: string, options?: RequestOptions): Promise<CrawlDeleteResponse> {
    try {
      const response = await apiClient.delete<CrawlDeleteResponse>(`/crawler/${jobId}`, {
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to delete crawl');
    }
  },

  /**
   * Delete a specific page from a crawl job
   * DELETE /crawler/{job_id}/page?url={url}
   */
  async deleteCrawlPage(
    jobId: string,
    url: string,
    options?: RequestOptions,
  ): Promise<CrawlDeletePageResponse> {
    try {
      const response = await apiClient.delete<CrawlDeletePageResponse>(`/crawler/${jobId}/page`, {
        params: { url },
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to delete crawl page');
    }
  },

  /**
   * Polling utility to wait for a crawl job to complete
   * Polls the status endpoint until completion or max attempts reached
   */
  async waitForCrawlCompletion(
    jobId: string,
    maxAttempts: number = 60,
    pollingInterval: number = 1000,
    options?: RequestOptions,
  ): Promise<CrawlStatusResponse> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getCrawlStatus(jobId, options);

          // Check if job is completed, stopped, failed, or revoked
          if (
            status.status === 'completed' ||
            status.status === 'stopped' ||
            status.status === 'failed' ||
            status.status === 'revoked'
          ) {
            resolve(status);
            return;
          }

          attempts++;
          if (attempts >= maxAttempts) {
            reject(
              new Error(
                `Crawl job did not complete within ${(maxAttempts * pollingInterval) / 1000}s`,
              ),
            );
            return;
          }

          setTimeout(poll, pollingInterval);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  },

  /**
   * Private helper to handle and standardize errors
   */
  _handleError(error: unknown, defaultMessage: string): Error {
    if (error instanceof Error) {
      // Check if it's an axios error with response
      const axiosError = error as Error & {
        response?: { data?: { detail?: string }; status?: number };
        message?: string;
      };
      if (axiosError.response?.data?.detail) {
        return new Error(axiosError.response.data.detail);
      }
      if (axiosError.response?.status === 401) {
        return new Error('Unauthorized. Please log in.');
      }
      if (axiosError.response?.status === 404) {
        return new Error('Job not found.');
      }
      if (axiosError.response?.status === 400) {
        return new Error(axiosError.response.data?.detail || 'Invalid request.');
      }
      if (axiosError.message === 'canceled') {
        return new Error('Request cancelled.');
      }
      return new Error(axiosError.message || defaultMessage);
    }
    return new Error(defaultMessage);
  },
};
