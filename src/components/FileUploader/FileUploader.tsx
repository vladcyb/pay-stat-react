import { useState, useCallback } from 'react'
import { PaymentData } from '../../types'
import styles from './FileUploader.module.scss'
import type { UnvalidatedData } from './types.ts'
import { validateData } from '../shared/validateData.ts'
import { useSearchParams } from 'react-router'

interface FileUploaderProps {
  onDataLoaded: (data: PaymentData) => void
}

export const FileUploader = ({ onDataLoaded }: FileUploaderProps) => {
  const [jsonUrl, setJsonUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const [, setSearchParams] = useSearchParams()

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
    [processData]
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jsonUrl) return

    if (!isValidUrl(jsonUrl)) {
      alert('Пожалуйста, введите корректный URL')
      return
    }

    setSearchParams({ source: jsonUrl })
  }

  return (
    <section
      className={`${styles.FileUploader} ${isDragging ? styles.FileUploader_dragging : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className={styles.FileUploader__options}>
        <div className={styles.FileUploader__option}>
          <p>Перетащите файл в формате JSON</p>
        </div>

        <div className={styles.FileUploader__divider}>ИЛИ</div>

        <div className={styles.FileUploader__option}>
          <input
            type="file"
            id="file-input"
            accept=".json"
            onChange={handleFileInput}
            className={styles.FileUploader__input}
          />
          <label
            htmlFor="file-input"
            className={styles.FileUploader__inputLabel}
          >
            Выбрать файл
          </label>
        </div>

        <div className={styles.FileUploader__divider}>ИЛИ</div>

        <div className={styles.option}>
          <p>Введите ссылку на JSON в текстовое поле и нажмите Enter.</p>
          <form onSubmit={handleUrlSubmit}>
            <input
              type="text"
              value={jsonUrl}
              onChange={(e) => setJsonUrl(e.target.value)}
              className={styles.FileUploader__urlInput}
              placeholder="https://example.com/data.json"
            />
          </form>
        </div>
      </div>
    </section>
  )
}
