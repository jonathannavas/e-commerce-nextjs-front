import axios from 'axios'
import Cookies from 'js-cookie'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, PropsWithChildren, useEffect, useReducer } from 'react'
import { tesloApi } from '../../axiosApi'
import { IUser } from '../../interfaces'
import { AuthContext, authReducer } from './'

export interface AuthState {
  isLoggedIn: boolean
  user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
  const router = useRouter()

  const { data, status } = useSession()
  useEffect(() => {
    if (status === 'authenticated') {
      dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
    }
  }, [status, data])

  // useEffect(() => {
  //   checkToken()
  // }, [])

  // const checkToken = async () => {
  //   if (!Cookies.get('token')) {
  //     return
  //   }

  //   try {
  //     const { data } = await tesloApi.post('/user/validate-token')
  //     const { token, user } = data
  //     Cookies.set('token', token)
  //     dispatch({ type: '[Auth] - Login', payload: user })
  //   } catch (error) {
  //     Cookies.remove('token')
  //   }
  // }

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password })
      const { token, user } = data
      Cookies.set('token', token)
      dispatch({ type: '[Auth] - Login', payload: user })
      return true
    } catch (error) {
      return false
    }
  }

  const handleRegisterUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post('/user/register', {
        email,
        password,
        name,
      })
      const { token, user } = data
      Cookies.set('token', token)
      dispatch({ type: '[Auth] - Login', payload: user })
      return {
        hasError: false,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        }
      }
      return {
        hasError: true,
        message: 'No se pudo crear el usuario, intente de nuevo',
      }
    }
  }

  const logout = () => {
    Cookies.remove('cart')
    Cookies.remove('userAddress')
    signOut()
    // Cookies.remove('token')
    // router.reload()
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        handleLogin,
        handleRegisterUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
