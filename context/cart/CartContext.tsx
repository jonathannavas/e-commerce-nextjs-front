import { createContext } from 'react'
import { ICartProduct } from '../../interfaces'
import { ShippingAddress } from './CartProvider'

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

  shippingAddress: ShippingAddress | undefined
  updateAddress: (address: ShippingAddress) => void
}

export const CartContext = createContext({} as ContextProps)
