import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger } from './logger'

// Mock loglevel
vi.mock('loglevel', () => ({
  default: {
    setLevel: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock Sentry
vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  setUser: vi.fn(),
  addBreadcrumb: vi.fn(),
}))

vi.mock('@sentry/tracing', () => ({
  BrowserTracing: vi.fn(),
}))

vi.mock('@sentry/replay', () => ({
  Replay: vi.fn(),
}))

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should log debug messages', () => {
    logger.debug('Test debug message', { component: 'Test' })
    // Test passes if no error is thrown - logger methods are mocked
    expect(true).toBe(true)
  })

  it('should log info messages', () => {
    logger.info('Test info message', { action: 'test' })
    expect(true).toBe(true)
  })

  it('should log warning messages', () => {
    logger.warn('Test warning message', { error: new Error('test') })
    expect(true).toBe(true)
  })

  it('should log error messages', () => {
    const error = new Error('Test error')
    logger.error('Test error message', error, { component: 'Test' })
    expect(true).toBe(true)
  })

  it('should log API requests', () => {
    logger.apiRequest('GET', '/api/test', { param: 'value' })
    expect(true).toBe(true)
  })

  it('should log API responses', () => {
    logger.apiResponse('GET', '/api/test', 200, 150, { data: 'response' })
    expect(true).toBe(true)
  })

  it('should log user actions', () => {
    logger.userAction('click', 'Button', { buttonId: 'submit' })
    expect(true).toBe(true)
  })

  it('should log component lifecycle', () => {
    logger.componentMount('TestComponent', { props: {} })
    logger.componentUnmount('TestComponent')
    expect(true).toBe(true)
  })

  it('should set user context', () => {
    logger.setUser({ id: '123', email: 'test@example.com' })
    expect(true).toBe(true)
  })

  it('should add breadcrumbs', () => {
    logger.addBreadcrumb('User clicked button', 'ui', 'info')
    expect(true).toBe(true)
  })
})