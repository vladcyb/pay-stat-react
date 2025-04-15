import { useCallback, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router'

import { Statistics } from '@/components'
import { validateData } from '@/lib'
import { PaymentData } from '@/types'

export const StatisticsWithData = () => {
  const [data, setData] = useState<PaymentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { source } = useParams()

  const fetchFromUrl = useCallback(async (url: string | undefined) => {
    if (!url) {
      setIsLoading(false)
      return
    }

    try {
      const decodedUrl = decodeURIComponent(url)
      const response = await fetch(decodedUrl, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const jsonData = await response.json()
      const validationResult = validateData(jsonData)

      if (!validationResult.isValid) {
        throw new Error(validationResult.error || 'Invalid data format')
      }

      setData(jsonData as PaymentData)
    } catch (error) {
      console.error('Error fetching data:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to load data. Please check the URL and try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFromUrl(source)
  }, [source, fetchFromUrl])

  if (isLoading) {
    return null
  }

  if (!data) {
    return <Navigate to="/" replace />
  }

  return <Statistics data={data} />
}
