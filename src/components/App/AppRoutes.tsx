import { Routes, Route, Navigate } from 'react-router'

import { StatisticsWithData } from './StatisticsWithData'
import { MainPage } from './MainPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/stats/:source" element={<StatisticsWithData />} />
      <Route path="/pay-stat-react/" element={<Navigate to="/" replace />} />
      <Route
        path="/pay-stat-react/stats/:source"
        element={<StatisticsWithData />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
