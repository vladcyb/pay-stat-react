import { useState } from 'react'
import { FileUploader } from './components/FileUploader/FileUploader'
import { Statistics } from './components/Statistics/Statistics'
import { FormatGuide } from './components/Guides/FormatGuide'
import { CategoriesGuide } from './components/Guides/CategoriesGuide'
import { PaymentData } from './types'

import styles from './App.module.scss'

function App() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  const handleDataLoaded = (data: PaymentData) => {
    setPaymentData(data)
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Анализ расходов</h1>
      </header>

      <main className={styles.main}>
        {!paymentData ? (
          <>
            <FileUploader onDataLoaded={handleDataLoaded} />
            <div className={styles.guides}>
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
