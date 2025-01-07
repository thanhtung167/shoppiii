import { Product } from './product.type.ts'

export interface PurchasesType {
  _id: string
  product: Product
  buy_count: number
  created_at: string
  updated_at: string
  price: number
  price_before_discount: number
  user: string
  status: PurchaseStatus
}

export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5

export type PurchaseListStatus = PurchaseStatus | 0

export interface ExtendPurchase extends PurchasesType {
  disabled: boolean
  checked: boolean
}