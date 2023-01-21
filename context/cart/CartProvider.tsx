import axios from 'axios'
import { default as Cookie } from 'js-cookie'
import { FC, PropsWithChildren, useEffect, useMemo, useReducer } from 'react'
import { tesloApi } from '../../api'
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces'
import { CartContext, cartReducer } from './'

export interface CartState {
  isLoaded: boolean
  cart: ICartProduct[]
  itemsCount: number
  subTotal: number
  tax: number
  total: number
  shippingAddress?: ShippingAddress
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
  itemsCount: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
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
    if (Cookie.get('userAddress')) {
      const shippingAddress: ShippingAddress = JSON.parse(
        Cookie.get('userAddress') || '[]'
      )

      dispatch({
        type: '[Cart] - Load Address from Cookies',
        payload: shippingAddress,
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

  const updateAddress = (address: ShippingAddress) => {
    Cookie.set('userAddress', JSON.stringify(address))
    dispatch({ type: '[Cart] - Update Address', payload: address })
  }

  const createOrder = async (): Promise<{
    hasError: boolean
    message: string
  }> => {
    if (!state.shippingAddress) {
      throw new Error('Agregar dirección de la entrega')
    }
    const body: IOrder = {
      orderItems: state.cart.map((p: any) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      itemsCount: state.itemsCount,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    }
    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body)
      setTimeout(() => {
        dispatch({ type: '[Cart] - Order Complete' })
      }, 300)

      return {
        hasError: false,
        message: data._id!,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message } = error.response?.data.message as { message: string }
        return {
          hasError: true,
          message,
        }
      }
      return {
        hasError: true,
        message: 'Error no  controlado hable con el administrador',
      }
    }
  }

  const memoValues = useMemo(
    () => ({
      ...state,
      addProductToCart,
      updateCartProductQuantity,
      removeCartProduct,
      updateAddress,
      createOrder,
    }),
    [state]
  )

  return (
    <CartContext.Provider value={memoValues}>{children}</CartContext.Provider>
  )
}
