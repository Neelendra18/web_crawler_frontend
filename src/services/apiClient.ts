import axios, { AxiosInstance, AxiosError, CancelTokenSource } from 'axios'
import { config } from '@utils/config'

class ApiClient {
  private client: AxiosInstance
  private cancelTokens: Map<string, CancelTokenSource> = new Map()

  constructor() {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: config.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      req => {
        if (config.enableDebugMode) {
          console.log('API Request:', req.method?.toUpperCase(), req.url, req.data)
        }
        return req
      },
      error => {
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.client.interceptors.response.use(
      res => {
        if (config.enableDebugMode) {
          console.log('API Response:', res.status, res.data)
        }
        return res
      },
      (error: AxiosError) => {
        console.error('API Error:', error.response?.status, error.response?.data)
        return Promise.reject(error)
      },
    )
  }

  public getClient() {
    return this.client
  }

  /**
   * Create a cancel token for request cancellation
   * Call cancel() to abort the request
   */
  public createCancelToken(key: string): CancelTokenSource {
    const source = axios.CancelToken.source()
    this.cancelTokens.set(key, source)
    return source
  }

  /**
   * Cancel a specific request by key
   */
  public cancelRequest(key: string, message: string = 'Request cancelled') {
    const source = this.cancelTokens.get(key)
    if (source) {
      source.cancel(message)
      this.cancelTokens.delete(key)
    }
  }

  /**
   * Cancel all pending requests
   */
  public cancelAllRequests(message: string = 'All requests cancelled') {
    this.cancelTokens.forEach(source => {
      source.cancel(message)
    })
    this.cancelTokens.clear()
  }
}

export const apiClient = new ApiClient().getClient()
export const apiClientManager = new ApiClient()
