export interface DayStats {
  date: string
  total: number
  payments: Array<{
    category: number
    value: number
    name: string
  }>
}
