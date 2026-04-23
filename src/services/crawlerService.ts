import { apiClient } from './apiClient'
import { CrawlRequest, CrawlResponse } from '@app-types/index'

interface RequestOptions {
  signal?: AbortSignal
}

export const crawlerService = {
  /**
   * Start a new web crawling and test generation job
   */
  async startCrawl(request: CrawlRequest, options?: RequestOptions): Promise<CrawlResponse> {
    // Handle file upload with FormData
    if (request.input_type === 'document' && request.document) {
      const formData = new FormData()
      formData.append('input_type', request.input_type)
      formData.append('document', request.document)
      formData.append('auth_type', request.auth_type)
      if (request.auth_config) {
        formData.append('auth_config', JSON.stringify(request.auth_config))
      }
      formData.append('framework', request.framework)
      formData.append('language', request.language)

      const response = await apiClient.post<CrawlResponse>('/api/crawl/start', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: options?.signal,
      })
      return response.data
    } else {
      // Regular JSON request for URL input
      const response = await apiClient.post<CrawlResponse>('/api/crawl/start', request, {
        signal: options?.signal,
      })
      return response.data
    }
  },

  /**
   * Get the status of a crawl job
   */
  async getCrawlStatus(jobId: string, options?: RequestOptions): Promise<CrawlResponse> {
    const response = await apiClient.get<CrawlResponse>(`/api/crawl/${jobId}/status`, {
      signal: options?.signal,
    })
    return response.data
  },

  /**
   * Cancel an ongoing crawl job
   */
  async cancelCrawl(jobId: string, options?: RequestOptions): Promise<void> {
    await apiClient.post(`/api/crawl/${jobId}/cancel`, null, {
      signal: options?.signal,
    })
  },

  /**
   * Download generated test files
   */
  async downloadTests(jobId: string, options?: RequestOptions): Promise<Blob> {
    const response = await apiClient.get(`/api/crawl/${jobId}/download`, {
      responseType: 'blob',
      signal: options?.signal,
    })
    return response.data
  },

  /**
   * Push generated tests to Git repository
   */
  async pushToGit(
    jobId: string,
    gitConfig: {
      repo_url: string
      branch: string
      commit_message?: string
    },
    options?: RequestOptions,
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/api/crawl/${jobId}/push-git`, gitConfig, {
      signal: options?.signal,
    })
    return response.data
  },

  /**
   * Get crawl job history
   */
  async getHistory(limit: number = 10, options?: RequestOptions): Promise<CrawlResponse[]> {
    const response = await apiClient.get<CrawlResponse[]>('/api/crawl/history', {
      params: { limit },
      signal: options?.signal,
    })
    return response.data
  },
}
