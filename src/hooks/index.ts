import React, { useEffect, useRef } from 'react'

/**
 * Hook to poll for updates at regular intervals with exponential backoff retry
 * @param callback Function to execute on each poll
 * @param interval Poll interval in milliseconds (default: 1000ms)
 * @param enabled Whether polling is enabled (default: true)
 * @param maxRetries Maximum number of retries on failure (default: 3)
 * @param onError Callback when max retries exceeded
 */
export function usePolling(
  callback: () => void | Promise<void>,
  interval: number = 1000,
  enabled: boolean = true,
  maxRetries: number = 3,
  onError?: (error: Error) => void,
) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const retriesRef = useRef(0)
  const currentIntervalRef = useRef(interval)

  useEffect(() => {
    if (!enabled) return

    const poll = async () => {
      try {
        await callback()
        // Reset retry count on success
        retriesRef.current = 0
        currentIntervalRef.current = interval
      } catch (error) {
        retriesRef.current++

        if (retriesRef.current >= maxRetries) {
          // Max retries exceeded
          const err = error instanceof Error ? error : new Error(String(error))
          onError?.(err)
          retriesRef.current = 0
          currentIntervalRef.current = interval
        } else {
          // Exponential backoff: double the interval up to max
          currentIntervalRef.current = Math.min(interval * Math.pow(2, retriesRef.current), 10000)
        }
      }

      timeoutRef.current = setTimeout(poll, currentIntervalRef.current)
    }

    poll()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [callback, interval, enabled, maxRetries, onError])
}

/**
 * Hook to handle async operations with loading and error states
 */
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true,
) {
  const [status, setStatus] = React.useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = React.useState<T | null>(null)
  const [error, setError] = React.useState<E | null>(null)

  const execute = React.useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)
    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as E)
      setStatus('error')
    }
  }, [asyncFunction])

  React.useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, data, error }
}

/**
 * Hook to manage form state
 */
export function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [values, setValues] = React.useState(initialValues)
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setValues(prev => ({ ...prev, [name]: fieldValue }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  const resetForm = () => {
    setValues(initialValues)
    setTouched({})
    setErrors({})
  }

  const setFieldValue = (name: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  return {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    resetForm,
    setFieldValue,
    setErrors,
  }
}

