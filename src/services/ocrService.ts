import { ocrApiClient } from './ocrApiClient';
import {
  OCRParseResponse,
  OCRStatusResponse,
  OCRDocumentsResponse,
  OCRExtractTextResponse,
  DocumentResultData,
} from '@app-types/index';

interface RequestOptions {
  signal?: AbortSignal;
}

/**
 * OCR Service
 * Provides methods to interact with the document-ocr backend API
 * Base URL: http://localhost:8001
 */
export const ocrService = {
  /**
   * Parse a document file and start OCR processing workflow
   * POST /api/parse
   * @param file - The document file to parse
   * @param provider - OCR provider to use (default: tesseract)
   * @param forceOcr - Force OCR even for native text extraction capable formats
   * @param extractImages - Extract images from document
   */
  async parseDocument(
    file: File,
    provider?: string,
    forceOcr?: boolean,
    extractImages?: boolean,
    options?: RequestOptions,
  ): Promise<OCRParseResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (provider) formData.append('provider', provider);
      if (forceOcr !== undefined) formData.append('force_ocr', String(forceOcr));
      if (extractImages !== undefined) formData.append('extract_images', String(extractImages));

      const response = await ocrApiClient.post<OCRParseResponse>('/api/parse', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to parse document');
    }
  },

  /**
   * Extract text from a document
   * POST /api/extract-text
   * @param file - The document file to extract text from
   * @param provider - OCR provider to use
   * @param forceOcr - Force OCR processing
   */
  async extractText(
    file: File,
    provider?: string,
    forceOcr?: boolean,
    options?: RequestOptions,
  ): Promise<OCRExtractTextResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (provider) formData.append('provider', provider);
      if (forceOcr !== undefined) formData.append('force_ocr', String(forceOcr));

      const response = await ocrApiClient.post<OCRExtractTextResponse>(
        '/api/extract-text',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: options?.signal,
        },
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to extract text');
    }
  },

  /**
   * Get the status of a document processing workflow
   * GET /api/status/{workflow_id}
   * @param workflowId - The workflow ID to check status for
   */
  async getProcessingStatus(
    workflowId: string,
    options?: RequestOptions,
  ): Promise<OCRStatusResponse> {
    try {
      const response = await ocrApiClient.get<OCRStatusResponse>(`/api/status/${workflowId}`, {
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get processing status');
    }
  },

  /**
   * Get the complete OCR result for a document
   * GET /api/documents/{document_id}
   * @param documentId - The document ID
   */
  async getDocumentResult(
    documentId: string,
    options?: RequestOptions,
  ): Promise<DocumentResultData> {
    try {
      const response = await ocrApiClient.get<DocumentResultData>(`/api/documents/${documentId}`, {
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get document result');
    }
  },

  /**
   * List all processed documents
   * GET /api/documents
   * @param skip - Number of documents to skip (for pagination)
   * @param limit - Maximum number of documents to return
   */
  async listDocuments(
    skip?: number,
    limit?: number,
    options?: RequestOptions,
  ): Promise<OCRDocumentsResponse> {
    try {
      const params = new URLSearchParams();
      if (skip !== undefined) params.append('skip', String(skip));
      if (limit !== undefined) params.append('limit', String(limit));

      const queryString = params.toString();
      const url = `/api/documents${queryString ? '?' + queryString : ''}`;

      const response = await ocrApiClient.get<OCRDocumentsResponse>(url, {
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to list documents');
    }
  },

  /**
   * Delete a processed document
   * DELETE /api/documents/{workflow_id}
   * @param workflowId - The workflow ID of the document to delete
   */
  async deleteDocument(
    workflowId: string,
    options?: RequestOptions,
  ): Promise<{ deleted: boolean }> {
    try {
      const response = await ocrApiClient.delete<{ deleted: boolean }>(
        `/api/documents/${workflowId}`,
        {
          signal: options?.signal,
        },
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to delete document');
    }
  },

  /**
   * Health check for OCR backend
   * GET /api/health
   */
  async healthCheck(options?: RequestOptions): Promise<{ status: string }> {
    try {
      const response = await ocrApiClient.get<{ status: string }>('/api/health', {
        signal: options?.signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Health check failed');
    }
  },

  /**
   * Private error handler
   */
  _handleError(error: unknown, defaultMessage: string): Error {
    if (error instanceof Error) {
      if ('response' in error && error.response) {
        const response = (error as Record<string, unknown>).response as Record<string, unknown>;
        const data = response?.data as Record<string, unknown>;
        const message = (data?.detail || data?.message || defaultMessage) as string;
        return new Error(message);
      }
      return error;
    }
    return new Error(defaultMessage);
  },
};
