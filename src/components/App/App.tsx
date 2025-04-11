import { AppRoutes } from './AppRoutes'

import styles from './App.module.scss'

export const App = () => (
  <div className={styles.App}>
    <header className={styles.App__header}>
      <h1 className={styles.App__title}>Анализ расходов</h1>
    </header>
    <main className={styles.App__main}>
      <AppRoutes />
    </main>
  </div>
)
