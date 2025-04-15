import { Payment } from './Payment'

export interface PaymentsByDate {
  [date: string]: Payment[]
}
