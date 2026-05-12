// Backend API Request/Response Types
export interface CrawlStartRequest {
  base_url: string;
  max_depth?: number; // 0-10, default 2
  excluded_urls?: string; // comma-separated patterns
  external_urls?: string[]; // array of external/third-party URLs
}

export interface CrawlStartResponse {
  job_id: string;
}

export interface CrawlPageResult {
  url: string;
  depth: number;
  status_code: number | null;
  title: string | null;
  links_found: number;
  error: string | null;
}

export interface CrawlStatusResponse {
  job_id: string;
  status: string; // pending, running, completed, stopped, revoked, failed
  unique_urls_discovered: number;
}

export interface CrawlResultsResponse {
  job_id: string;
  status: string;
  pages: CrawlPageResult[];
}

export interface CrawlUrlsResponse {
  job_id: string;
  status: string;
  urls: string[];
}

export interface CrawlSitemapResponse {
  site_url: string;
  total_pages_crawled: number;
  crawled_at: string;
  url_tree: SitemapNode;
  page_summaries: PageSummary[];
  shared_navigation: SharedNavigation;
  external_destinations: ExternalDestination[];
  link_graph: unknown[];
}

export interface SitemapNode {
  url: string;
  page_id: string;
  title: string;
  has_page_data: boolean;
  children: SitemapNode[];
}

export interface PageSummary {
  page_id: string;
  url: string;
  title: string;
  meta_description: string | null;
}

export interface SharedNavigation {
  header: string[];
  footer: string[];
}

export interface ExternalDestination {
  url: string;
  referenced_as: string;
}

export interface ProcessedPageResponse {
  page_id: string;
  crawl_job_id: string;
  url: string;
  title: string;
  actionable_elements: unknown[];
  breadcrumbs: string[];
  headings_outline: unknown[];
  body_text: string;
  metadata: Record<string, unknown>;
  response_status: number;
  processed_at: string;
}

export interface CrawlStopResponse {
  job_id: string;
  status: string;
  message?: string;
}

export interface CrawlDeleteResponse {
  job_id: string;
  deleted_crawl_jobs: number;
  deleted_crawl_pages: number;
  deleted_crawl_sitemaps: number;
  deleted_processed_pages: number;
}

export interface CrawlDeletePageResponse {
  job_id: string;
  url: string;
  deleted_crawl_pages: number;
  deleted_processed_pages: number;
}

// Frontend UI Types
export interface TestCase {
  id: string;
  name: string;
  description: string;
  code: string;
}

// Auth Types
export type AuthType = 'None (Public)' | 'Basic' | 'OAuth2' | 'API Key';

export interface AuthConfig {
  [key: string]: string | number | boolean | undefined;
}

// UI State Types
export interface CrawlerState {
  isLoading?: boolean;
  error: string | null;
  currentJobId?: string | null;
  jobStatus?: string | null;
  inputType: 'url' | 'document';
  websiteUrl: string;
  documentFile: File | null;
  authType: AuthType;
  authConfig: AuthConfig;
  framework: 'Playwright' | 'Selenium';
  language: 'TypeScript' | 'Python';
  isRunning: boolean;
}

export interface ProcessingState {
  currentStep: number;
  totalSteps: number;
  pagesCrawled: number;
  testCases: number;
  generatedFiles: number;
  batches: BatchStatus[];
  logs: LogEntry[];
}

export interface BatchStatus {
  id: string;
  name: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
}

export interface LogEntry {
  timestamp: Date;
  message: string;
  level: 'info' | 'warning' | 'error' | 'success';
  id: string;
}

export interface PipelineStep {
  id: string;
  name: string;
  completed: boolean;
  active: boolean;
}
