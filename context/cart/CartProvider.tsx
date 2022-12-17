import Cookie from 'js-cookie'
import { FC, PropsWithChildren, useEffect, useReducer } from 'react'
import { ICartProduct } from '../../interfaces'
import { CartContext, cartReducer } from './'

export interface CartState {
  cart: ICartProduct[]
  itemsCount: number
  subTotal: number
  tax: number
  total: number
}

const CART_INITIAL_STATE: CartState = {
  cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
  itemsCount: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
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

  useEffect(() => {
    const itemsCount = state.cart.reduce(
      (prev, current: ICartProduct) => current.quantity + prev,
      0
    )
    const subTotal = state.cart.reduce(
      (prev, current: ICartProduct) => current.price * current.quantity + prev,
      0
    )

    const taxRate: number = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

    const orderSummary = {
      itemsCount,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    }
    dispatch({ type: '[Cart] - Update Order Sumary', payload: orderSummary })
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
