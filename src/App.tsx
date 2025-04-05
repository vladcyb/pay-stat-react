import { useState } from 'react'
import { FileUploader } from './components/FileUploader/FileUploader'
import { Statistics } from './components/Statistics/Statistics'
import { PaymentData } from './types'
import { FormatGuide } from './components/guides/FormatGuide'
import { CategoriesGuide } from './components/guides/CategoriesGuide'

import styles from './App.module.scss'

function App() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  const handleDataLoaded = (data: PaymentData) => {
    setPaymentData(data)
  }

  return (
    <div className={styles.App}>
      <header className={styles.App__header}>
        <h1 className={styles.App__title}>Анализ расходов</h1>
      </header>
      <main className={styles.App__main}>
        {!paymentData ? (
          <>
            <FileUploader onDataLoaded={handleDataLoaded} />
            <div className={styles.App__guides}>
              <FormatGuide />
              <CategoriesGuide />
            </div>
          </>
        ) : (
          <Statistics data={paymentData} />
        )}
      </main>
    </div>
  )
}

export default App
