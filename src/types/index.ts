export interface Payment {
  category: number
  value: number
  name: string
}

export interface PaymentsByDate {
  [date: string]: Payment[]
}

export interface PaymentData {
  title: string
  payments: PaymentsByDate
}

export interface Category {
  id: number
  name: string
  description: string
}
