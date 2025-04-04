import { useMemo, useState } from 'react'
import { PaymentData, Payment } from '../../types'
import { categoryRussian } from '../../shared/constants/categoryRussian'
import { DailyStatistics } from './DailyStatistics'
import styles from './Statistics.module.scss'

interface StatisticsProps {
  data: PaymentData
}

interface CategoryStats {
  total: number
  count: number
  items: Payment[]
}

type Tab = 'categories' | 'daily'

export const Statistics = ({ data }: StatisticsProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('categories')

  const stats = useMemo(() => {
    const categoryStats: Record<number, CategoryStats> = {}
    let totalSpent = 0

    Object.entries(data.payments).forEach(([, payments]) => {
      payments.forEach((payment) => {
        if (!categoryStats[payment.category]) {
          categoryStats[payment.category] = {
            total: 0,
            count: 0,
            items: [],
          }
        }

        categoryStats[payment.category].total += payment.value
        categoryStats[payment.category].count += 1
        categoryStats[payment.category].items.push(payment)
        totalSpent += payment.value
      })
    })

    // Сортируем покупки в каждой категории от самых дорогих к самым дешевым
    Object.values(categoryStats).forEach((category) => {
      category.items.sort((a, b) => b.value - a.value)
    })

    return {
      categoryStats,
      totalSpent,
    }
  }, [data])

  const sortedCategories = useMemo(() => {
    return Object.entries(stats.categoryStats).sort(
      (a, b) => b[1].total - a[1].total
    )
  }, [stats.categoryStats])

  return (
    <div className={styles.container}>
      <h2>{data.title}</h2>
      <div className={styles.totalSpent}>
        <h3>Общая сумма расходов:</h3>
        <p>{stats.totalSpent}</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === 'categories' ? styles.active : ''
          }`}
          onClick={() => setActiveTab('categories')}
        >
          По категориям
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'daily' ? styles.active : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          По дням
        </button>
      </div>

      {activeTab === 'categories' ? (
        <div className={styles.categories}>
          <h3>Расходы по категориям:</h3>
          {sortedCategories.map(([category, categoryStat]) => (
            <div key={category} className={styles.category}>
              <h4>
                {
                  categoryRussian[
                    Number(category) as keyof typeof categoryRussian
                  ]
                }
              </h4>
              <p>Всего: {categoryStat.total}</p>
              <p>Количество покупок: {categoryStat.count}</p>
              <div className={styles.items}>
                {categoryStat.items.map((item, index) => (
                  <div key={index} className={styles.item}>
                    <span>{item.name}</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DailyStatistics data={data} />
      )}
    </div>
  )
}
