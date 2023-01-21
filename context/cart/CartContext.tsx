import { createContext } from 'react'
import { ICartProduct, ShippingAddress } from '../../interfaces'

interface ContextProps {
  isLoaded: boolean
  cart: ICartProduct[]
  addProductToCart: (product: ICartProduct) => void
  updateCartProductQuantity: (product: ICartProduct) => void
  removeCartProduct: (product: ICartProduct) => void
  itemsCount: number
  subTotal: number
  tax: number
  total: number

  shippingAddress?: ShippingAddress
  updateAddress: (address: ShippingAddress) => void
  createOrder: () => Promise<{
    hasError: boolean
    message: string
  }>
}

export const CartContext = createContext({} as ContextProps)
