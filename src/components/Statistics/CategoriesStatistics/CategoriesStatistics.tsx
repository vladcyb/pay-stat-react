import { PaymentData } from '@/types'
import { categoryMap, CategoryMapIndex } from '@/constants'

import styles from './CategoriesStatistics.module.scss'

type Props = {
  data: PaymentData
}

export const CategoriesStatistics = ({ data }: Props) => {
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

  return (
    <div className={styles.CategoriesStatistics}>
      {sortedCategories.map(({ category, total }) => (
        <div key={category} className={styles.CategoriesStatistics__category}>
          <h4>{categoryMap[category as CategoryMapIndex].name}</h4>
          <p>Общая сумма: {total}</p>
          <div className={styles.CategoriesStatistics__items}>
            {categoryPayments[category]?.map((payment, index) => (
              <div
                key={`${payment.date}-${index}`}
                className={styles.CategoriesStatistics__item}
              >
                <span>{payment.name}</span>
                <span>{payment.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
