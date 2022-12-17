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

    default:
      return state
  }
}
