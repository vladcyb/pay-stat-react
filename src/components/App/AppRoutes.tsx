import { Routes, Route, Navigate } from 'react-router'

import { StatisticsWithData } from './StatisticsWithData'
import { MainPage } from './MainPage'
import { BASE_URL } from '../../shared/constants/baseUrl'

export const AppRoutes = () => (
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
