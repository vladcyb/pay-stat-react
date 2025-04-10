import { Routes, Route, Navigate } from 'react-router'

import { StatisticsWithData } from './StatisticsWithData'
import { MainPage } from './MainPage'

export const AppRoutes = () => {
  const { BASE_URL } = import.meta.env

  return (
    <Routes>
      <Route path={BASE_URL} element={<MainPage />} />
      <Route path="/stats/:source" element={<StatisticsWithData />} />
      <Route path="/" element={<Navigate to={BASE_URL} replace />} />
      <Route
        path="/pay-stat-react/stats/:source"
        element={<StatisticsWithData />}
      />
      <Route path="*" element={<Navigate to={BASE_URL} replace />} />
    </Routes>
  )
}
