import React, { useState, useEffect, useRef } from 'react'
import {
  useCrawlerStore,
  useProcessingStore,
} from '@store/crawlerStore'
import {
  Input,
  Select,
  Button,
  StatusIndicator,
  Pipeline,
  Batches,
  LogViewer,
  TestPreview,
  FileUpload,
} from '@components/index'
import { PipelineStep, AuthType } from '@app-types/index'
import { crawlerService } from '@services/crawlerService'
import { logger } from '@utils/logger'
import './CrawlerPage.css'

const CrawlerPage: React.FC = () => {
  const crawlerState = useCrawlerStore()
  const crawlerActions = useCrawlerStore(state => ({
    setInputType: state.setInputType,
    setWebsiteUrl: state.setWebsiteUrl,
    setDocumentFile: state.setDocumentFile,
    setAuthType: state.setAuthType,
    setAuthConfig: state.setAuthConfig,
    setFramework: state.setFramework,
    setLanguage: state.setLanguage,
    setIsRunning: state.setIsRunning,
    setError: state.setError,
    reset: state.reset,
  }))
  const processingState = useProcessingStore()
  const processingActions = useProcessingStore(state => ({
    clearLogs: state.clearLogs,
    reset: state.reset,
    setCurrentStep: state.setCurrentStep,
    setPagesCrawled: state.setPagesCrawled,
    setTestCases: state.setTestCases,
    setGeneratedFiles: state.setGeneratedFiles,
    addLog: state.addLog,
  }))
  const pollRef = useRef<number | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string>('')

  // Component lifecycle logging
  useEffect(() => {
    logger.componentMount('CrawlerPage')
    return () => {
      logger.componentUnmount('CrawlerPage')
    }
  }, [])

  const pipelineSteps: PipelineStep[] = [
    { id: 's1', name: 'Crawl Website (URL Discovery & Fetch)', active: false, completed: false },
    { id: 's2', name: 'Structure Crawled Pages', active: false, completed: false },
    { id: 's3', name: 'Initialize Test Project', active: false, completed: false },
    { id: 's4', name: 'Generate Test Code (LLM-Driven)', active: false, completed: false },
    { id: 's5', name: 'Validate, Heal & Finalize', active: false, completed: false },
  ]

  const updatedSteps = pipelineSteps.map((step, idx) => ({
    ...step,
    active: idx === processingState.currentStep,
    completed: idx < processingState.currentStep,
  }))

  const handleAuthTypeChange = (value: string) => {
    crawlerState.setAuthType(value as AuthType)
  }

  const stopPolling = () => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  const handleStart = async () => {
    logger.userAction('start_crawl', 'CrawlerPage', {
      inputType: crawlerState.inputType,
      websiteUrl: crawlerState.websiteUrl,
      documentFile: crawlerState.documentFile?.name,
      framework: crawlerState.framework,
      language: crawlerState.language
    })

    try {
      stopPolling()
      abortControllerRef.current?.abort()

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setIsLoading(true)
      setStatusMessage('Initializing crawl...')
      processingActions.clearLogs()
      processingActions.reset()

      const request = {
        input_type: crawlerState.inputType,
        ...(crawlerState.inputType === 'url' && { website_url: crawlerState.websiteUrl }),
        ...(crawlerState.inputType === 'document' && crawlerState.documentFile && { document: crawlerState.documentFile }),
        auth_type: crawlerState.authType,
        auth_config: crawlerState.authConfig,
        framework: crawlerState.framework as 'Playwright' | 'Selenium',
        language: crawlerState.language as 'TypeScript' | 'Python',
      }

      const inputDescription = crawlerState.inputType === 'url'
        ? crawlerState.websiteUrl
        : crawlerState.documentFile?.name || 'uploaded document'

      processingActions.addLog({
        message: `Starting crawl for ${inputDescription}`,
        level: 'info',
      })

      const response = await crawlerService.startCrawl(request, {
        signal: abortController.signal,
      })
      crawlerActions.setIsRunning(true)
      setStatusMessage('Generating test cases')
      processingActions.addLog({
        message: `Job started with ID: ${response.id}`,
        level: 'success',
      })

      pollRef.current = window.setInterval(async () => {
        try {
          const status = await crawlerService.getCrawlStatus(response.id, {
            signal: abortController.signal,
          })

          processingActions.setPagesCrawled(status.pages_crawled)
          processingActions.setTestCases(status.test_cases)
          processingActions.setGeneratedFiles(status.generated_files)

          if (status.status === 'completed') {
            stopPolling()
            crawlerActions.setIsRunning(false)
            setStatusMessage('Completed')
            processingActions.setCurrentStep(5)
            processingActions.addLog({
              message: 'Crawl completed successfully',
              level: 'success',
            })
            setIsLoading(false)
          } else if (status.status === 'failed') {
            stopPolling()
            crawlerActions.setIsRunning(false)
            setStatusMessage('Failed')
            processingActions.addLog({
              message: `Error: ${status.error}`,
              level: 'error',
            })
            setIsLoading(false)
          } else {
            const step = Math.min(
              Math.floor((status.progress || 0) / 20),
              processingState.totalSteps - 1,
            )
            processingActions.setCurrentStep(step)
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'CanceledError') {
            return
          }

          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          processingActions.addLog({
            message: `Status check failed: ${errorMessage}. Backend may be unreachable.`,
            level: 'error',
          })
        }
      }, 1000)
    } catch (error) {
      const errorMessage = error instanceof Error
        ? `Network Error: ${error.message}. Is the backend running at http://localhost:8000?`
        : 'Network Error: Failed to start crawl. Is the backend running?'
      logger.error('Failed to start crawl', error instanceof Error ? error : new Error(errorMessage), {
        component: 'CrawlerPage',
        action: 'start_crawl',
        inputType: crawlerState.inputType,
        websiteUrl: crawlerState.inputType === 'url' ? crawlerState.websiteUrl : undefined,
        documentFile: crawlerState.inputType === 'document' ? crawlerState.documentFile?.name : undefined
      })
      crawlerActions.setError(errorMessage)
      processingActions.addLog({
        message: errorMessage,
        level: 'error',
      })
      setStatusMessage('Connection Failed')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      stopPolling()
      abortControllerRef.current?.abort()
    }
  }, [])

  const handleDownload = async () => {
    // Implement download logic
    processingState.addLog({
      message: 'Download started',
      level: 'info',
    })
  }

  const handlePushToGit = async () => {
    // Implement git push logic
    processingState.addLog({
      message: 'Git push initiated',
      level: 'info',
    })
  }

  return (
    <div className="crawler-app">
      {/* LEFT SIDEBAR */}
      <div className="crawler-left">
        <h3 className="section-title">Input Source</h3>
        <Select
          label="Input Type"
          options={[
            { label: 'Website URL', value: 'url' },
            { label: 'Upload Document', value: 'document' },
          ]}
          value={crawlerState.inputType}
          onChange={e => crawlerActions.setInputType(e.target.value as 'url' | 'document')}
          disabled={crawlerState.isRunning}
        />

        {crawlerState.inputType === 'url' ? (
          <Input
            label="Website URL"
            value={crawlerState.websiteUrl}
            onChange={e => crawlerActions.setWebsiteUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={crawlerState.isRunning}
          />
        ) : (
          <FileUpload
            label="Document File"
            accept=".pdf,.doc,.docx,.txt,.md,.brd"
            onFileSelect={crawlerActions.setDocumentFile}
            selectedFile={crawlerState.documentFile}
            disabled={crawlerState.isRunning}
            maxSizeMB={50}
          />
        )}

        <h3 className="section-title" style={{ marginTop: '24px' }}>
          Target Application Authentication
        </h3>
        <Select
          label="Auth Type"
          options={[
            { label: 'None (Public)', value: 'None (Public)' },
            { label: 'Form Login', value: 'Form Login' },
            { label: 'SSO / OAuth', value: 'SSO / OAuth' },
          ]}
          value={crawlerState.authType}
          onChange={e => handleAuthTypeChange(e.target.value)}
          disabled={crawlerState.isRunning}
        />

        {crawlerState.authType !== 'None (Public)' && (
          <div className="auth-fields">
            <Input
              label="Login URL"
              placeholder="https://example.com/login"
              disabled={crawlerState.isRunning}
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                disabled={crawlerState.isRunning}
                onChange={e =>
                  crawlerState.setAuthConfig({
                    ...crawlerState.authConfig,
                    reuse_session: e.target.checked,
                  })
                }
              />
              <span>Reuse session cookies</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                disabled={crawlerState.isRunning}
                onChange={e =>
                  crawlerState.setAuthConfig({
                    ...crawlerState.authConfig,
                    capture_screenshots: e.target.checked,
                  })
                }
              />
              <span>Capture auth screenshots</span>
            </label>
          </div>
        )}

        <h3 className="section-title" style={{ marginTop: '24px' }}>
          Test Generation
        </h3>
        <Select
          label="Framework"
          options={[
            { label: 'Playwright', value: 'Playwright' },
            { label: 'Selenium', value: 'Selenium' },
          ]}
          value={crawlerState.framework}
          onChange={e => crawlerState.setFramework(e.target.value as 'Playwright' | 'Selenium')}
          disabled={crawlerState.isRunning}
        />
        <Select
          label="Language"
          options={[
            { label: 'TypeScript', value: 'TypeScript' },
            { label: 'Python', value: 'Python' },
          ]}
          value={crawlerState.language}
          onChange={e => crawlerState.setLanguage(e.target.value as 'TypeScript' | 'Python')}
          disabled={crawlerState.isRunning}
        />

        <Button
          variant="primary"
          onClick={handleStart}
          isLoading={isLoading}
          disabled={
            crawlerState.isRunning ||
            (crawlerState.inputType === 'url' && !crawlerState.websiteUrl) ||
            (crawlerState.inputType === 'document' && !crawlerState.documentFile)
          }
          style={{ marginTop: '16px' }}
        >
          {crawlerState.isRunning ? 'Generating...' : 'Generate Test Cases'}
        </Button>

        <StatusIndicator
          status={
            crawlerState.isRunning ? 'running' : crawlerState.error ? 'failed' : 'idle'
          }
          label={statusMessage || (crawlerState.isRunning ? 'Generating test cases' : 'Idle')}
        />
      </div>

      {/* CENTER CONTENT */}
      <div className="crawler-center">
        <h1 className="main-title">Web Crawler → Test Case Generation</h1>
        <p className="subtitle">URL-driven crawling with automated test case and code generation</p>

        <Pipeline steps={updatedSteps} />

        <Batches batches={processingState.batches} />

        <TestPreview tests={processingState.logs as any} isLoading={crawlerState.isRunning} />

        <div className="button-group">
          <Button variant="secondary" onClick={handleDownload} disabled={crawlerState.isRunning}>
            ⬇ Download Tests
          </Button>
          <Button variant="secondary" onClick={handlePushToGit} disabled={crawlerState.isRunning}>
            ⬆ Push to Git Repository
          </Button>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="crawler-right">
        <h3 className="section-title">Status</h3>
        <div className="metric">
          <span>Pages Crawled</span>
          <span className="metric-value">{processingState.pagesCrawled}</span>
        </div>
        <div className="metric">
          <span>Test Cases</span>
          <span className="metric-value">{processingState.testCases}</span>
        </div>
        <div className="metric">
          <span>Generated Test Files</span>
          <span className="metric-value">{processingState.generatedFiles}</span>
        </div>

        <h3 className="section-title" style={{ marginTop: '24px' }}>
          Activity Log
        </h3>
        <LogViewer logs={processingState.logs} maxHeight={400} />
      </div>
    </div>
  )
}

export default CrawlerPage
