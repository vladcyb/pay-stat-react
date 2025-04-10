import { useMemo, useState } from 'react'
import { PaymentData } from '../../types'
import {
  categoryMap,
  CategoryMapIndex,
} from '../../shared/constants/categoryMap.ts'
import styles from './DailyStatistics.module.scss'
import { formatNumber } from '../../shared/lib/formatNumber.ts'

interface DailyStatisticsProps {
  data: PaymentData
}

interface DayStats {
  date: string
  total: number
  payments: Array<{
    category: number
    value: number
    name: string
  }>
}

export const DailyStatistics = ({ data }: DailyStatisticsProps) => {
  const [regexFilter, setRegexFilter] = useState('')

  const formatDate = (dateStr: string) => {
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    return `${day}.${month}.${year}`
  }

  const dailyStats = useMemo(() => {
    const stats: DayStats[] = Object.entries(data.payments).map(
      ([date, payments]) => {
        const total = payments.reduce((sum, payment) => sum + payment.value, 0)
        return {
          date,
          total,
          payments: [...payments].sort((a, b) => b.value - a.value), // Сортировка по убыванию суммы
        }
      }
    )

    // Сортировка дней по убыванию даты (сначала новые)
    return stats.sort((a, b) => b.date.localeCompare(a.date))
  }, [data])

  const filteredDailyStats = useMemo(() => {
    if (!regexFilter) return dailyStats

    try {
      const regex = new RegExp(`^${regexFilter}$`, 'i')
      return dailyStats.filter((day) => regex.test(formatDate(day.date)))
    } catch (error) {
      console.error('Invalid regex pattern:', error)
      // Если регулярное выражение некорректное, показываем все дни
      return dailyStats
    }
  }, [dailyStats, regexFilter])

  const totalFilteredExpenses = useMemo(() => {
    return filteredDailyStats.reduce((sum, day) => sum + day.total, 0)
  }, [filteredDailyStats])

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <input
          className={styles.filterInput}
          type="text"
          value={regexFilter}
          onChange={(e) => setRegexFilter(e.target.value)}
          placeholder="Фильтр по дате (регулярное выражение)"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>
      <div className={styles.totalFilteredExpenses}>
        <h3>Общая сумма расходов за выбранный период</h3>
        <p>{formatNumber(totalFilteredExpenses)}</p>
      </div>
      {filteredDailyStats.map((day) => (
        <div key={day.date} className={styles.dayCard}>
          <div className={styles.dayHeader}>
            <h3>{formatDate(day.date)}</h3>
            <span className={styles.dayTotal}>Всего за день: {day.total}</span>
          </div>
          <div className={styles.payments}>
            {day.payments.map((payment, index) => (
              <div key={index} className={styles.payment}>
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentName}>{payment.name}</span>
                  <span className={styles.paymentCategory}>
                    {categoryMap[payment.category as CategoryMapIndex].name}
                  </span>
                </div>
                <span className={styles.paymentValue}>{payment.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
