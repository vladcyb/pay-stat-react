import { FileUploader } from '../../FileUploader/FileUploader.tsx'
import styles from '../App.module.scss'
import { FormatGuide } from '../../guides/FormatGuide'
import { CategoriesGuide } from '../../guides/CategoriesGuide'
import { Statistics } from '../../Statistics/Statistics.tsx'
import { useState } from 'react'
import { PaymentData } from '../../../types'

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
