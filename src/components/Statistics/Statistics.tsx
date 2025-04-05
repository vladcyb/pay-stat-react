import { useState } from 'react'
import { PaymentData } from '../../types'
import { categoryRussian } from '../../shared/constants/categoryRussian'
import { DailyStatistics } from './DailyStatistics'
import { ChartStatistics } from './ChartStatistics'
import styles from './Statistics.module.scss'

interface StatisticsProps {
  data: PaymentData
}

type Tab = 'categories' | 'daily' | 'charts'

export const Statistics = ({ data }: StatisticsProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('categories')

  const totalSpent = Object.values(data.payments).reduce(
    (total, dayPayments) =>
      total + dayPayments.reduce((sum, payment) => sum + payment.value, 0),
    0
  )

  // Собираем все покупки в один массив и сортируем по стоимости
  const allPayments = Object.entries(data.payments)
    .flatMap(([date, payments]) =>
      payments.map((payment) => ({ ...payment, date }))
    )
    .sort((a, b) => b.value - a.value)

  // Группируем отсортированные покупки по категориям
  const categoryPayments: Record<number, typeof allPayments> = {}
  allPayments.forEach((payment) => {
    if (!categoryPayments[payment.category]) {
      categoryPayments[payment.category] = []
    }
    categoryPayments[payment.category].push(payment)
  })

  const categoryTotals: Record<number, number> = {}
  Object.values(data.payments).forEach((payments) => {
    payments.forEach((payment) => {
      categoryTotals[payment.category] =
        (categoryTotals[payment.category] || 0) + payment.value
    })
  })

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([category, total]) => ({
      category: Number(category),
      total,
    }))

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{data.title}</h2>
      <div className={styles.totalSpent}>
        <h3>Общая сумма расходов</h3>
        <p>{totalSpent}</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'categories' ? styles.active : ''}`}
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
        <button
          className={`${styles.tab} ${activeTab === 'charts' ? styles.active : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          Графики
        </button>
      </div>

      {activeTab === 'categories' && (
        <div className={styles.categories}>
          {sortedCategories.map(({ category, total }) => (
            <div key={category} className={styles.category}>
              <h4>
                {categoryRussian[category as keyof typeof categoryRussian]}
              </h4>
              <p>Общая сумма: {total}</p>
              <div className={styles.items}>
                {categoryPayments[category]?.map((payment, index) => (
                  <div key={`${payment.date}-${index}`} className={styles.item}>
                    <span>{payment.name}</span>
                    <span>{payment.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'daily' && <DailyStatistics data={data} />}
      {activeTab === 'charts' && <ChartStatistics data={data} />}
    </div>
  )
}
