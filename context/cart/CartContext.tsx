import { createContext } from 'react'
import { ICartProduct } from '../../interfaces'

interface ContextProps {
  cart: ICartProduct[]
  addProductToCart: (product: ICartProduct) => void
  updateCartProductQuantity: (product: ICartProduct) => void
  removeCartProduct: (product: ICartProduct) => void
  itemsCount: number
  subTotal: number
  tax: number
  total: number
}

export const CartContext = createContext({} as ContextProps)
