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

    vi.runOnlyPendingTimers()
    expect(callback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1000)
    expect(callback.mock.calls.length).toBeGreaterThan(1)
  })
})
