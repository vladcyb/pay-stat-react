import { useState } from 'react'

import { formatNumber } from '@/lib'
import { PaymentData } from '@/types'

import { CategoriesStatistics } from './CategoriesStatistics'
import { ChartStatistics } from './ChartStatistics'
import { DailyStatistics } from './DailyStatistics'
import { Tabs } from './Tabs'
import { TabEnum } from './types'

import styles from './Statistics.module.scss'

type Props = {
  data: PaymentData
}

export const Statistics = ({ data }: Props) => {
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
