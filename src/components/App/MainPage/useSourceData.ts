import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { PaymentData } from '../../../types'

export const useSourceData = () => {
  const [data, setData] = useState<PaymentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { source } = useParams()

  const handleDataLoaded = useCallback((data: PaymentData) => {
    setData(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (source) {
    } else {
      setIsLoading(false)
    }
  }, [source])

  return {
    isLoading,
    data,
    handleDataLoaded,
  }
}
