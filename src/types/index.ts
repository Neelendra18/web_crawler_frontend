// API Request/Response Types
export interface CrawlRequest {
  input_type: 'url' | 'document'
  website_url?: string
  document?: File
  auth_type: AuthType
  auth_config?: AuthConfig
  framework: 'Playwright' | 'Selenium'
  language: 'TypeScript' | 'Python'
}

export interface AuthConfig {
  login_url?: string
  reuse_session?: boolean
  capture_screenshots?: boolean
  credentials?: {
    username: string
    password: string
  }
}

export type AuthType = 'None (Public)' | 'Form Login' | 'SSO / OAuth'

export interface CrawlResponse {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  pages_crawled: number
  test_cases: number
  generated_files: number
  tests: TestCase[]
  error?: string
}

export interface TestCase {
  id: string
  name: string
  description: string
  code: string
}

// UI State Types
export interface CrawlerState {
  inputType: 'url' | 'document'
  websiteUrl: string
  documentFile: File | null
  authType: AuthType
  authConfig: AuthConfig
  framework: 'Playwright' | 'Selenium'
  language: 'TypeScript' | 'Python'
  isRunning: boolean
  error: string | null
}

export interface ProcessingState {
  currentStep: number
  totalSteps: number
  pagesCrawled: number
  testCases: number
  generatedFiles: number
  batches: BatchStatus[]
  logs: LogEntry[]
}

export interface BatchStatus {
  id: string
  name: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  progress: number
}

export interface LogEntry {
  timestamp: Date
  message: string
  level: 'info' | 'warning' | 'error' | 'success'
  id: string
}

export interface PipelineStep {
  id: string
  name: string
  completed: boolean
  active: boolean
}
