import Cookie from 'js-cookie'
import { FC, PropsWithChildren, useEffect, useReducer } from 'react'
import { ICartProduct } from '../../interfaces'
import { CartContext, cartReducer } from './'

export interface CartState {
  cart: ICartProduct[]
}

const CART_INITIAL_STATE: CartState = {
  cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
}

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

  useEffect(() => {
    try {
      const productsFromCookies = Cookie.get('cart')
        ? JSON.parse(Cookie.get('cart')!)
        : []
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: productsFromCookies,
      })
    } catch (error) {
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: [],
      })
    }
  }, [])

  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart))
  }, [state.cart])

  const addProductToCart = (product: ICartProduct) => {
    const checkProductInCart = state.cart.some((p) => p._id === product._id)
    if (!checkProductInCart) {
      return dispatch({
        type: '[Cart] - Add Products to Cart',
        payload: [...state.cart, product],
      })
    }

    const checkProductWithSameSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    )
    if (!checkProductWithSameSize) {
      return dispatch({
        type: '[Cart] - Add Products to Cart',
        payload: [...state.cart, product],
      })
    }

    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p
      if (p.size !== product.size) return p

      // update quantity
      p.quantity += product.quantity
      return p
    })

    dispatch({
      type: '[Cart] - Add Products to Cart',
      payload: updatedProducts,
    })
  }

  const updateCartProductQuantity = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Update Quantity Product on Cart',
      payload: product,
    })
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Remove Product in Cart',
      payload: product,
    })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateCartProductQuantity,
        removeCartProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
