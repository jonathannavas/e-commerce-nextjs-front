import { ICartProduct } from '../../interfaces'
import { CartState } from './'

type CartActionType =
  | {
      type: '[Cart] - LoadCart from cookies | storage'
      payload: ICartProduct[]
    }
  | {
      type: '[Cart] - Add Products to Cart'
      payload: ICartProduct[]
    }
  | {
      type: '[Cart] - Update Quantity Product on Cart'
      payload: ICartProduct
    }
  | {
      type: '[Cart] - Remove Product in Cart'
      payload: ICartProduct
    }
  | {
      type: '[Cart] - Update Order Sumary'
      payload: {
        itemsCount: number
        subTotal: number
        tax: number
        total: number
      }
    }

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case '[Cart] - LoadCart from cookies | storage':
      return {
        ...state,
        cart: [...action.payload],
      }

    case '[Cart] - Add Products to Cart':
      return {
        ...state,
        cart: [...action.payload],
      }
    case '[Cart] - Update Quantity Product on Cart':
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product
          if (product.size !== action.payload.size) return product

          product.quantity = action.payload.quantity
          return product
        }),
      }

    case '[Cart] - Remove Product in Cart':
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            !(
              product._id === action.payload._id &&
              product.size === action.payload.size
            )
        ),
      }

    case '[Cart] - Update Order Sumary':
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state
  }
}
