import { FileUploader } from '../FileUploader/FileUploader.tsx'
import { FormatGuide } from '../guides/FormatGuide'
import { CategoriesGuide } from '../guides/CategoriesGuide'
import { Statistics } from '../Statistics/Statistics.tsx'
import { useData } from './useData.ts'

import styles from './App.module.scss'

export const App = () => {
  const { data, handleDataLoaded } = useData()

  return (
    <div className={styles.App}>
      <header className={styles.App__header}>
        <h1 className={styles.App__title}>Анализ расходов</h1>
      </header>
      <main className={styles.App__main}>
        {!data ? (
          <>
            <FileUploader onDataLoaded={handleDataLoaded} />
            <div className={styles.App__guides}>
              <FormatGuide />
              <CategoriesGuide />
            </div>
          </>
        ) : (
          <Statistics data={data} />
        )}
      </main>
    </div>
  )
}
