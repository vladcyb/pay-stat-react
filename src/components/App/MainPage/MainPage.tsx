import { useState } from 'react'

import { PaymentData } from '@/types/PaymentData'
import { Statistics } from '@/components/Statistics'
import { FileUploader } from '@/components/FileUploader/FileUploader'
import { FormatGuide } from '@/components/FormatGuide'
import { CategoriesGuide } from '@/components/CategoriesGuide'

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
