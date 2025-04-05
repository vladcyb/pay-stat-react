import { useState, useCallback } from 'react'
import { PaymentData } from '../../types'
import styles from './FileUploader.module.scss'
import { categoryRussian } from '../../shared/constants/categoryRussian'

interface FileUploaderProps {
  onDataLoaded: (data: PaymentData) => void
}

interface UnvalidatedPayment {
  category?: number
  value?: number
  name?: string
  [key: string]: unknown
}

interface UnvalidatedData {
  title?: string
  payments?: Record<string, UnvalidatedPayment[]>
  [key: string]: unknown
}

const validateData = (
  data: UnvalidatedData
): { isValid: boolean; error?: string } => {
  // Проверка наличия обязательных полей
  if (!data.title || typeof data.title !== 'string') {
    return {
      isValid: false,
      error: 'Отсутствует или неверный формат поля "title"',
    }
  }

  if (!data.payments || typeof data.payments !== 'object') {
    return {
      isValid: false,
      error: 'Отсутствует или неверный формат поля "payments"',
    }
  }

  // Проверка формата дат и платежей
  for (const date of Object.keys(data.payments)) {
    // Проверка формата даты (ГГГГММДД)
    if (!/^\d{8}$/.test(date)) {
      return {
        isValid: false,
        error: `Неверный формат даты: ${date}. Ожидается формат ГГГГММДД`,
      }
    }

    const payments = data.payments[date]
    if (!Array.isArray(payments)) {
      return {
        isValid: false,
        error: `Платежи для даты ${date} должны быть массивом`,
      }
    }

    // Проверка каждого платежа
    for (const payment of payments) {
      if (
        !Object.hasOwn(payment, 'category') ||
        !Object.hasOwn(payment, 'value') ||
        !Object.hasOwn(payment, 'name')
      ) {
        return {
          isValid: false,
          error: 'Каждый платеж должен содержать поля category, value и name',
        }
      }

      if (!Object.keys(categoryRussian).includes(String(payment.category))) {
        return {
          isValid: false,
          error: `Неверная категория: ${payment.category}. Доступны категории от 1 до 23`,
        }
      }

      if (typeof payment.value !== 'number' || payment.value <= 0) {
        return {
          isValid: false,
          error: 'Сумма платежа должна быть положительным числом',
        }
      }

      if (typeof payment.name !== 'string' || payment.name.trim() === '') {
        return {
          isValid: false,
          error: 'Название платежа должно быть непустой строкой',
        }
      }
    }
  }

  return { isValid: true }
}

export const FileUploader = ({ onDataLoaded }: FileUploaderProps) => {
  const [jsonUrl, setJsonUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const processData = useCallback((data: UnvalidatedData) => {
    const validation = validateData(data)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }
    return data as PaymentData
  }, [])

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        const validatedData = processData(data)
        onDataLoaded(validatedData)
      } catch (error) {
        console.error('Error processing JSON file:', error)
        alert(
          error instanceof Error
            ? error.message
            : 'Ошибка при чтении файла. Убедитесь, что файл имеет правильный формат JSON.'
        )
      }
    },
    [onDataLoaded, processData]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type === 'application/json') {
        handleFileUpload(file)
      } else {
        alert('Пожалуйста, загрузите файл в формате JSON')
      }
    },
    [handleFileUpload]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileUpload(file)
      }
    },
    [handleFileUpload]
  )

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleUrlSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!jsonUrl) return

      if (!isValidUrl(jsonUrl)) {
        alert('Пожалуйста, введите корректный URL')
        return
      }

      try {
        const response = await fetch(jsonUrl, {
          mode: 'cors',
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const validatedData = processData(data)
        onDataLoaded(validatedData)
      } catch (error) {
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
    },
    [jsonUrl, onDataLoaded, processData]
  )

  return (
    <div
      className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className={styles.uploadOptions}>
        <div className={styles.option}>
          <p>Перетащите файл в формате JSON</p>
        </div>

        <div className={styles.divider}>ИЛИ</div>

        <div className={styles.option}>
          <input
            type="file"
            id="file-input"
            accept=".json"
            onChange={handleFileInput}
            className={styles.fileInput}
          />
          <label htmlFor="file-input" className={styles.fileInputLabel}>
            Выбрать файл
          </label>
        </div>

        <div className={styles.divider}>ИЛИ</div>

        <div className={styles.option}>
          <p>Введите ссылку на JSON в текстовое поле и нажмите Enter</p>
          <form onSubmit={handleUrlSubmit}>
            <input
              type="text"
              value={jsonUrl}
              onChange={(e) => setJsonUrl(e.target.value)}
              className={styles.urlInput}
              placeholder="https://example.com/data.json"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
