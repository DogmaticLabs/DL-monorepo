'use client'

import { useSearchParams } from '@/components/providers'
import { useCallback, useEffect, useState } from 'react'

/**
 * A hook for reading and updating URL parameters
 *
 * @returns Object with URL parameter utilities
 */
export function useUrlParams() {
  // Get the current search params from context
  const params = useSearchParams()

  /**
   * Set a URL parameter and update the browser history
   *
   * @param key The parameter key
   * @param value The parameter value
   * @param options Options for updating the URL
   */
  const setParam = useCallback(
    (
      key: string,
      value: string | number | boolean | null | undefined,
      options: {
        replace?: boolean // Whether to replace the current history entry
        removeIfEmpty?: boolean // Whether to remove the parameter if value is empty
      } = {},
    ) => {
      if (typeof window === 'undefined') return

      const url = new URL(window.location.href)

      // Handle null/undefined/empty values
      if (value === null || value === undefined || (options.removeIfEmpty && value === '')) {
        url.searchParams.delete(key)
      } else {
        // Convert value to string
        const stringValue = value.toString()
        url.searchParams.set(key, stringValue)
      }

      // Update browser history
      if (options.replace) {
        window.history.replaceState({}, '', url.toString())
      } else {
        window.history.pushState({}, '', url.toString())
      }
    },
    [],
  )

  /**
   * Remove a URL parameter
   *
   * @param key The parameter key to remove
   * @param options Options for updating the URL
   */
  const removeParam = useCallback((key: string, options: { replace?: boolean } = {}) => {
    if (typeof window === 'undefined') return

    const url = new URL(window.location.href)
    url.searchParams.delete(key)

    // Update browser history
    if (options.replace) {
      window.history.replaceState({}, '', url.toString())
    } else {
      window.history.pushState({}, '', url.toString())
    }
  }, [])

  /**
   * Update multiple URL parameters at once
   *
   * @param updates Object with parameter key-value pairs to update
   * @param options Options for updating the URL
   */
  const updateParams = useCallback(
    (
      updates: Record<string, string | number | boolean | null | undefined>,
      options: {
        replace?: boolean
        removeIfEmpty?: boolean
      } = {},
    ) => {
      if (typeof window === 'undefined') return

      const url = new URL(window.location.href)

      // Process each parameter update
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || (options.removeIfEmpty && value === '')) {
          url.searchParams.delete(key)
        } else {
          url.searchParams.set(key, value.toString())
        }
      })

      // Update browser history
      if (options.replace) {
        window.history.replaceState({}, '', url.toString())
      } else {
        window.history.pushState({}, '', url.toString())
      }
    },
    [],
  )

  /**
   * Get the current value of a URL parameter
   *
   * @param key The parameter key
   * @param defaultValue Optional default value if parameter doesn't exist
   * @returns The parameter value or default value
   */
  const getParam = useCallback(
    <T extends string | number | boolean>(
      key: string,
      defaultValue?: T,
    ): string | T | undefined => {
      const value = params[key]

      if (value === undefined) {
        return defaultValue
      }

      return value
    },
    [params],
  )

  /**
   * Check if a URL parameter exists
   *
   * @param key The parameter key
   * @returns True if the parameter exists
   */
  const hasParam = useCallback(
    (key: string): boolean => {
      return params[key] !== undefined
    },
    [params],
  )

  /**
   * Generate a URL with the current parameters
   *
   * @param baseUrl Optional base URL (defaults to current path)
   * @param paramOverrides Optional parameter overrides
   * @returns The generated URL
   */
  const generateUrl = useCallback(
    (
      baseUrl?: string,
      paramOverrides?: Record<string, string | number | boolean | null | undefined>,
    ): string => {
      if (typeof window === 'undefined') return ''

      const url = new URL(baseUrl || window.location.pathname, window.location.origin)

      // Add current params
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })

      // Apply overrides
      if (paramOverrides) {
        Object.entries(paramOverrides).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            url.searchParams.delete(key)
          } else {
            url.searchParams.set(key, value.toString())
          }
        })
      }

      return url.toString()
    },
    [params],
  )

  return {
    // Raw params
    params,

    // Param operations
    setParam,
    removeParam,
    updateParams,
    getParam,
    hasParam,
    generateUrl,
  }
}

// Options interface for useUrlParam
interface UseUrlParamOptions {
  persistDefault?: boolean
}

// Make a read observer on the url so if the url changes, the state changes
export function useUrlParam<T extends string | number | boolean>(
  key: string,
  defaultValue?: T,
  options?: UseUrlParamOptions,
): [T | undefined, (value: T | undefined) => void] {
  const { getParam, setParam, removeParam } = useUrlParams()
  const persistDefault = options?.persistDefault ?? false

  // Initialize state with current URL param or default value
  const [value, setValue] = useState<T | undefined>(() => {
    const paramValue = getParam(key) as T | undefined

    // If param is not in URL but we have a default value, set it in the URL if configured to do so
    if (paramValue === undefined && defaultValue !== undefined && persistDefault) {
      setParam(key, defaultValue)
      return defaultValue
    }

    return paramValue !== undefined ? paramValue : defaultValue
  })

  // Set up an effect to listen for URL changes
  useEffect(() => {
    // Update state when URL parameters change
    const currentValue = getParam(key, defaultValue) as T | undefined
    setValue(currentValue)

    // Listen for URL/history changes
    const handleUrlChange = () => {
      const newValue = getParam(key, defaultValue) as T | undefined
      setValue(newValue)
    }

    window.addEventListener('popstate', handleUrlChange)

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [key, defaultValue, getParam])

  // Return the current value and a setter function
  return [
    value,
    (newValue: T | undefined) => {
      setValue(newValue)

      // Remove the parameter from URL if value is undefined
      if (newValue === undefined) {
        removeParam(key)
      } else {
        setParam(key, newValue)
      }
    },
  ]
}
