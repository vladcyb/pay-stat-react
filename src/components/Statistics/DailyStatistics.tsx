import { useMemo } from 'react'
import { PaymentData } from '../../types'
import { categoryRussian } from '../../shared/constants/categoryRussian'
import styles from './DailyStatistics.module.scss'

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

  const formatDate = (dateStr: string) => {
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    return `${day}.${month}.${year}`
  }

  return (
    <div className={styles.container}>
      {dailyStats.map((day) => (
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
                    {
                      categoryRussian[
                        payment.category as keyof typeof categoryRussian
                      ]
                    }
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
