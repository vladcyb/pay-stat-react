import { useState } from 'react'

import { FileUploader, FormatGuide, Statistics } from '@/components'
import { CategoriesGuide } from '@/components/CategoriesGuide'
import { PaymentData } from '@/types'

import styles from '@/components/App/App.module.scss'

export const MainPage = () => {
  const [data, setData] = useState<PaymentData | null>(null)

  return data ? (
    <Statistics data={data} />
  ) : (
    <>
      <FileUploader onDataLoaded={setData} />
      <div className={styles.App__guides}>
        <FormatGuide />
        <CategoriesGuide />
      </div>
    </>
  )
}
