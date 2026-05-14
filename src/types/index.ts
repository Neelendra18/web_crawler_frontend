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

// OCR API Types
export interface OCRParseResponse {
  workflowId: string;
  status: 'processing' | 'completed' | 'failed' | 'error';
}

export interface OCRStatusResponse {
  status: 'processing' | 'completed' | 'failed' | 'error';
  result?: DocumentResultData;
  error?: string;
}

export interface BBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface ParentTag {
  tag: string;
  text: string;
}

export interface SegmentData {
  id: string;
  type: string;
  tag?: string;
  text: string;
  bbox?: BBox;
  reading_order: number;
  language?: string;
  token_count: number;
  confidence?: number;
  chunk_ready: boolean;
  parent_tags?: ParentTag[];
  mime_type?: string;
  base64_data?: string;
  description?: string;
  image_classification?: string;
  columns?: string[];
  rows?: Array<Record<string, string>>;
  merged_cells?: boolean;
  pairs?: Array<Record<string, string>>;
}

export interface SegmentCounts {
  detected: number;
  processed: number;
  failed: number;
}

export interface ImageCounts extends SegmentCounts {
  graphical_images: number;
  text_images: number;
}

export interface PageSummaryOCR {
  total_segments: number;
  images: ImageCounts;
  tables: SegmentCounts;
  paragraphs: SegmentCounts;
  key_value_blocks: SegmentCounts;
  headings: SegmentCounts;
  chunk_ready_segments: number;
  chunk_skipped_segments: number;
  low_confidence_segments: number;
}

export interface PageResultOCR {
  page_number: number;
  has_images: boolean;
  has_tables: boolean;
  is_scanned: boolean;
  extraction_method: string;
  page_summary: PageSummaryOCR;
  segments: SegmentData[];
}

export interface DocumentMetadataOCR {
  filename: string;
  page_count: number;
  author?: string;
  created_at?: string;
  modified_at?: string;
  language?: string;
}

export interface DocumentProcessingSummary {
  total_pages: number;
  total_segments: number;
  images: ImageCounts;
  tables: SegmentCounts;
  paragraphs: SegmentCounts;
  key_value_blocks: SegmentCounts;
  headings: SegmentCounts;
  chunk_ready_segments: number;
  chunk_skipped_segments: number;
  overall_quality_score?: number;
}

export interface LogWarning {
  segment_id: string;
  warning_type: string;
  message: string;
}

export interface ProcessingLog {
  pipeline_version: string;
  processing_time_ms: number;
  errors: string[];
  warnings: LogWarning[];
}

export interface HierarchyNode {
  heading: string;
  level: number;
  content: string[];
  children: HierarchyNode[];
}

export interface DocumentResultData {
  document_id: string;
  file_type: string;
  content_hash: string;
  extraction_method: string;
  metadata: DocumentMetadataOCR;
  document_processing_summary: DocumentProcessingSummary;
  pages: PageResultOCR[];
  hierarchy: HierarchyNode[];
  processing_log: ProcessingLog;
}

export interface DocumentListItem {
  workflow_id: string;
  document_id: string;
  filename: string;
  file_type: string;
  status: string;
  page_count: number;
  created_at: string;
}

export interface OCRDocumentsResponse {
  documents: DocumentListItem[];
}

export interface OCRExtractTextResponse {
  text: string;
  filename: string;
}
