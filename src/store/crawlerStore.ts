import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import {
  CrawlerState,
  AuthType,
  AuthConfig,
  ProcessingState,
  BatchStatus,
  LogEntry,
} from '@types/index'

interface CrawlerStore extends CrawlerState {
  // Setters
  setWebsiteUrl: (url: string) => void
  setAuthType: (authType: AuthType) => void
  setAuthConfig: (config: AuthConfig) => void
  setFramework: (framework: 'Playwright' | 'Selenium') => void
  setLanguage: (language: 'TypeScript' | 'Python') => void
  setIsRunning: (running: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialCrawlerState: CrawlerState = {
  websiteUrl: 'https://example.com',
  authType: 'None (Public)',
  authConfig: {},
  framework: 'Playwright',
  language: 'TypeScript',
  isRunning: false,
  error: null,
}

export const useCrawlerStore = create<CrawlerStore>()(
  subscribeWithSelector(set => ({
    ...initialCrawlerState,
    setWebsiteUrl: (url: string) => set({ websiteUrl: url }),
    setAuthType: (authType: AuthType) => set({ authType }),
    setAuthConfig: (authConfig: AuthConfig) => set({ authConfig }),
    setFramework: (framework: 'Playwright' | 'Selenium') => set({ framework }),
    setLanguage: (language: 'TypeScript' | 'Python') => set({ language }),
    setIsRunning: (isRunning: boolean) => set({ isRunning }),
    setError: (error: string | null) => set({ error }),
    reset: () => set(initialCrawlerState),
  })),
)

// Memoized selectors for CrawlerStore
export const selectCrawlerFormState = (state: CrawlerStore) => ({
  websiteUrl: state.websiteUrl,
  authType: state.authType,
  authConfig: state.authConfig,
  framework: state.framework,
  language: state.language,
})

export const selectCrawlerRunningState = (state: CrawlerStore) => ({
  isRunning: state.isRunning,
  error: state.error,
})

// Processing State Store
interface ProcessingStore extends ProcessingState {
  setCurrentStep: (step: number) => void
  setTotalSteps: (total: number) => void
  setPagesCrawled: (count: number) => void
  setTestCases: (count: number) => void
  setGeneratedFiles: (count: number) => void
  setBatches: (batches: BatchStatus[]) => void
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  clearLogs: () => void
  reset: () => void
}

const initialProcessingState: ProcessingState = {
  currentStep: 0,
  totalSteps: 5,
  pagesCrawled: 0,
  testCases: 0,
  generatedFiles: 0,
  batches: [],
  logs: [],
}

export const useProcessingStore = create<ProcessingStore>()(
  subscribeWithSelector(set => ({
    ...initialProcessingState,
    setCurrentStep: (currentStep: number) => set({ currentStep }),
    setTotalSteps: (totalSteps: number) => set({ totalSteps }),
    setPagesCrawled: (pagesCrawled: number) => set({ pagesCrawled }),
    setTestCases: (testCases: number) => set({ testCases }),
    setGeneratedFiles: (generatedFiles: number) => set({ generatedFiles }),
    setBatches: (batches: BatchStatus[]) => set({ batches }),
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) =>
      set(state => ({
        logs: [
          {
            ...entry,
          id: `log_${Date.now()}_${Math.random()}`,
          timestamp: new Date(),
        },
        ...state.logs,
      ].slice(0, 100), // Keep last 100 logs
    })),
  clearLogs: () => set({ logs: [] }),
  reset: () => set(initialProcessingState),
})),
)

// Memoized selectors for ProcessingStore
export const selectProcessingMetrics = (state: ProcessingStore) => ({
  pagesCrawled: state.pagesCrawled,
  testCases: state.testCases,
  generatedFiles: state.generatedFiles,
})

export const selectProcessingProgress = (state: ProcessingStore) => ({
  currentStep: state.currentStep,
  totalSteps: state.totalSteps,
})

export const selectProcessingLogs = (state: ProcessingStore) => ({
  logs: state.logs,
})

export const selectProcessingBatches = (state: ProcessingStore) => ({
  batches: state.batches,
})
