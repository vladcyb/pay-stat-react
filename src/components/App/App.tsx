import { useLocation, useNavigate } from 'react-router'
import { useCallback } from 'react'

import { AppRoutes } from './AppRoutes'
import { Button } from '../shared/Button'

import styles from './App.module.scss'

export const App = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { BASE_URL } = import.meta.env

  const onMainPageBtnClick = useCallback(() => {
    navigate(BASE_URL)
  }, [])

  return (
    <div className={styles.App}>
      {pathname !== BASE_URL && (
        <Button onClick={onMainPageBtnClick}>На главную</Button>
      )}
      <header className={styles.App__header}>
        <h1 className={styles.App__title}>Анализ расходов</h1>
      </header>
      <main className={styles.App__main}>
        <AppRoutes />
      </main>
    </div>
  )
}
