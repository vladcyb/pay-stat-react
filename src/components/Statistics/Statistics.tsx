import { useState } from 'react'

import { PaymentData } from '../../types'
import { DailyStatistics } from './DailyStatistics'
import { ChartStatistics } from './ChartStatistics'
import { CategoriesStatistics } from './CategoriesStatistics'
import { formatNumber } from '../../shared/lib/formatNumber'

import styles from './Statistics.module.scss'
import { TabEnum } from './types.ts'
import { Tabs } from './Tabs.tsx'

interface StatisticsProps {
  data: PaymentData
}

export const Statistics = ({ data }: StatisticsProps) => {
  const [activeTab, setActiveTab] = useState<TabEnum>(TabEnum.categories)

  const totalSpent = Object.values(data.payments).reduce(
    (total, dayPayments) =>
      total + dayPayments.reduce((sum, payment) => sum + payment.value, 0),
    0
  )

  return (
    <div className={styles.Statistics}>
      <h2 className={styles.Statistics__title}>{data.title}</h2>
      <div className={styles.Statistics__totalSpent}>
        <h3>Общая сумма расходов</h3>
        <p>{formatNumber(totalSpent)}</p>
      </div>

      <div className={styles.Statistics__tabs}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {activeTab === TabEnum.categories && <CategoriesStatistics data={data} />}
      {activeTab === TabEnum.daily && <DailyStatistics data={data} />}
      {activeTab === TabEnum.charts && <ChartStatistics data={data} />}
    </div>
  )
}
