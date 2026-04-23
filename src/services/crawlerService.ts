import { apiClient } from './apiClient'
import { CrawlRequest, CrawlResponse } from '@types/index'

export const crawlerService = {
  /**
   * Start a new web crawling and test generation job
   */
  async startCrawl(request: CrawlRequest): Promise<CrawlResponse> {
    const response = await apiClient.post<CrawlResponse>('/api/crawl/start', request)
    return response.data
  },

  /**
   * Get the status of a crawl job
   */
  async getCrawlStatus(jobId: string): Promise<CrawlResponse> {
    const response = await apiClient.get<CrawlResponse>(`/api/crawl/${jobId}/status`)
    return response.data
  },

  /**
   * Cancel an ongoing crawl job
   */
  async cancelCrawl(jobId: string): Promise<void> {
    await apiClient.post(`/api/crawl/${jobId}/cancel`)
  },

  /**
   * Download generated test files
   */
  async downloadTests(jobId: string): Promise<Blob> {
    const response = await apiClient.get(`/api/crawl/${jobId}/download`, {
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Push generated tests to Git repository
   */
  async pushToGit(jobId: string, gitConfig: {
    repo_url: string
    branch: string
    commit_message?: string
  }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/api/crawl/${jobId}/push-git`, gitConfig)
    return response.data
  },

  /**
   * Get crawl job history
   */
  async getHistory(limit: number = 10): Promise<CrawlResponse[]> {
    const response = await apiClient.get<CrawlResponse[]>('/api/crawl/history', {
      params: { limit },
    })
    return response.data
  },
}
