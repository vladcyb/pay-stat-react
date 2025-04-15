import { Navigate, Route, Routes } from 'react-router'

import { MainPage } from './MainPage'
import { StatisticsWithData } from './StatisticsWithData'

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainPage />} />
    <Route path="stats/:source" element={<StatisticsWithData />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
