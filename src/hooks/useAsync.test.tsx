import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useAsync } from './index'

const AsyncComponent = ({ asyncFunction, immediate }: { asyncFunction: () => Promise<string>; immediate?: boolean }) => {
  const { execute, status, data } = useAsync(asyncFunction, immediate)

  return (
    <div>
      <button onClick={execute}>Execute</button>
      <span data-testid="status">{status}</span>
      <span data-testid="data">{data ?? ''}</span>
    </div>
  )
}

describe('useAsync', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('runs the async function immediately when immediate is true', async () => {
    const asyncFunction = vi.fn().mockResolvedValue('finished')
    render(<AsyncComponent asyncFunction={asyncFunction} immediate={true} />)

    expect(asyncFunction).toHaveBeenCalledTimes(1)
    await screen.findByText(/finished/)
    expect(screen.getByTestId('status').textContent).toBe('success')
    expect(screen.getByTestId('data').textContent).toBe('finished')
  })

  it('executes async function when execute is called manually', async () => {
    const asyncFunction = vi.fn().mockResolvedValue('manual')
    render(<AsyncComponent asyncFunction={asyncFunction} immediate={false} />)

    expect(screen.getByTestId('status').textContent).toBe('idle')
    fireEvent.click(screen.getByText('Execute'))
    expect(asyncFunction).toHaveBeenCalledTimes(1)
    await screen.findByText(/manual/)
    expect(screen.getByTestId('status').textContent).toBe('success')
    expect(screen.getByTestId('data').textContent).toBe('manual')
  })
})
