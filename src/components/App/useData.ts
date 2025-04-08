import { useEffect, useState } from 'react'
import { PaymentData } from '../../types'
import { useSearchParams } from 'react-router'
import { validateData } from '../shared/validateData.ts'

export const useData = () => {
  const [data, setData] = useState<PaymentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams] = useSearchParams()

  const handleDataLoaded = (data: PaymentData) => {
    setData(data)
    setIsLoading(false)
  }

  const fetchFromUrl = async (url: string | null) => {
    if (!url) {
      return
    }
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      validateData(data)
      setData(data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching JSON from URL:', error)
      if (
        error instanceof TypeError &&
        error.message.includes('Failed to fetch')
      ) {
        alert(
          'Не удалось загрузить данные. Возможные причины:\n' +
            '- URL недоступен\n' +
            '- Сервер не поддерживает CORS\n' +
            '- Проблемы с сетевым подключением'
        )
      } else {
        alert(
          'Ошибка при загрузке данных по URL: ' +
            (error instanceof Error ? error.message : 'Неизвестная ошибка')
        )
      }
    }
  }

  const sourceUrl = searchParams.get('source')

  useEffect(() => {
    if (searchParams.has('source')) {
      fetchFromUrl(sourceUrl)
    } else {
      setIsLoading(false)
    }
  }, [sourceUrl])

  return {
    isLoading,
    data,
    handleDataLoaded,
  }
}
