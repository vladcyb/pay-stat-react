export interface UnvalidatedData {
  title?: string
  payments?: Record<string, UnvalidatedPayment[]>
  [key: string]: unknown
}

export interface UnvalidatedPayment {
  category?: number
  value?: number
  name?: string
  [key: string]: unknown
}
