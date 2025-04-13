import { useMemo, useState } from 'react'

import { PaymentData } from '../../../types'
import {
  categoryMap,
  CategoryMapIndex,
} from '../../../shared/constants/categoryMap.ts'
import { formatDate } from '../../../shared/lib/formatDate.ts'
import { DateSelector } from '../../DateSelector'
import { DayStats } from '../../../shared/types/DayStats.ts'

import styles from './DailyStatistics.module.scss'

interface DailyStatisticsProps {
  data: PaymentData
}

export const DailyStatistics = ({ data }: DailyStatisticsProps) => {
  const [regexFilter, setRegexFilter] = useState('')

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

  const filteredDailyPayments = useMemo(() => {
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

  return (
    <div className={styles.DailyStatistics}>
      <DateSelector
        regexFilter={regexFilter}
        setRegexFilter={setRegexFilter}
        filteredDailyPayments={filteredDailyPayments}
      />
      {filteredDailyPayments.map((day) => (
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
                <strong>{payment.value}</strong>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
