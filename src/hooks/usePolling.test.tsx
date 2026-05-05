import { render, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { usePolling } from './index'

const TestComponent = ({ callback }: { callback: () => void }) => {
  usePolling(callback, 100, true)
  return null
}

describe('usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('calls callback repeatedly at the specified interval', () => {
    const callback = vi.fn()

    render(<TestComponent callback={callback} />)

    // The first call is immediate, advance timers for subsequent calls
    vi.advanceTimersByTime(200) // 2 intervals of 100ms
    // Run all pending timers to ensure setTimeout callbacks are processed
    return vi.runOnlyPendingTimersAsync().then(() => {
      expect(callback.mock.calls.length).toBeGreaterThan(1)
    })
  })
})
