import type { UnvalidatedData } from '@/components/FileUploader/types'
import { categoryMap } from '@/constants'

export const validateData = (
  data: UnvalidatedData
): { isValid: boolean; error?: string } => {
  // Проверка наличия обязательных полей
  if (!data.title) {
    return {
      isValid: false,
      error: 'Отсутствует поле "title".',
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

      if (!Object.keys(categoryMap).includes(String(payment.category))) {
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
