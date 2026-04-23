import React, { useState, useEffect } from 'react'
import { useCrawlerStore, useProcessingStore } from '@store/crawlerStore'
import {
  Input,
  Select,
  Button,
  StatusIndicator,
  Pipeline,
  Batches,
  LogViewer,
  TestPreview,
} from '@components/index'
import { PipelineStep, AuthType } from '@types/index'
import { crawlerService } from '@services/crawlerService'
import './CrawlerPage.css'

const CrawlerPage: React.FC = () => {
  const crawlerState = useCrawlerStore()
  const processingState = useProcessingStore()
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string>('')

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

  const handleStart = async () => {
    try {
      setIsLoading(true)
      setStatusMessage('Initializing crawl...')
      processingState.clearLogs()
      processingState.reset()

      const request = {
        website_url: crawlerState.websiteUrl,
        auth_type: crawlerState.authType,
        auth_config: crawlerState.authConfig,
        framework: crawlerState.framework as 'Playwright' | 'Selenium',
        language: crawlerState.language as 'TypeScript' | 'Python',
      }

      processingState.addLog({
        message: `Starting crawl for ${crawlerState.websiteUrl}`,
        level: 'info',
      })

      const response = await crawlerService.startCrawl(request)
      crawlerState.setIsRunning(true)
      setStatusMessage('Generating test cases')
      processingState.addLog({
        message: `Job started with ID: ${response.id}`,
        level: 'success',
      })

      // Poll for updates
      const pollInterval = setInterval(async () => {
        try {
          const status = await crawlerService.getCrawlStatus(response.id)

          processingState.setPagesCrawled(status.pages_crawled)
          processingState.setTestCases(status.test_cases)
          processingState.setGeneratedFiles(status.generated_files)

          if (status.status === 'completed') {
            clearInterval(pollInterval)
            crawlerState.setIsRunning(false)
            setStatusMessage('Completed')
            processingState.setCurrentStep(5)
            processingState.addLog({
              message: 'Crawl completed successfully',
              level: 'success',
            })
            setIsLoading(false)
          } else if (status.status === 'failed') {
            clearInterval(pollInterval)
            crawlerState.setIsRunning(false)
            setStatusMessage('Failed')
            processingState.addLog({
              message: `Error: ${status.error}`,
              level: 'error',
            })
            setIsLoading(false)
          } else {
            const step = Math.min(
              Math.floor((status.progress || 0) / 20),
              processingState.totalSteps - 1,
            )
            processingState.setCurrentStep(step)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          processingState.addLog({
            message: `Status check failed: ${errorMessage}. Backend may be unreachable.`,
            level: 'error',
          })
        }
      }, 1000)
    } catch (error) {
      const errorMessage = error instanceof Error
        ? `Network Error: ${error.message}. Is the backend running at http://localhost:8000?`
        : 'Network Error: Failed to start crawl. Is the backend running?'
      crawlerState.setError(errorMessage)
      processingState.addLog({
        message: errorMessage,
        level: 'error',
      })
      setStatusMessage('Connection Failed')
      setIsLoading(false)
    }
  }

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
        <h3 className="section-title">Website Input</h3>
        <Input
          label="Website URL"
          value={crawlerState.websiteUrl}
          onChange={e => crawlerState.setWebsiteUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={crawlerState.isRunning}
        />

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
          disabled={crawlerState.isRunning || !crawlerState.websiteUrl}
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
