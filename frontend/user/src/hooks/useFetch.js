import { useState, useEffect, useCallback } from 'react'

/**
 * Hook tái sử dụng cho việc gọi API
 * @param {Function} apiFunc - Hàm gọi API
 * @param {Array} deps - Dependencies để trigger lại
 * @param {boolean} immediate - Gọi ngay khi mount
 */
export default function useFetch(apiFunc, deps = [], immediate = true) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFunc(...args)
      setData(result.data || result)
      return result
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra')
      throw err
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, execute, setData }
}
