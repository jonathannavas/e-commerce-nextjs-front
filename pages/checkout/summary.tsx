import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'

import Cookies from 'js-cookie'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../context/cart/CartContext'
import { countries } from '../../utils'

const SummaryPage = () => {
  const { shippingAddress, itemsCount, isLoaded, cart, createOrder } =
    useContext(CartContext)
  const router = useRouter()
  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.replace('/cart/empty')
    }
  }, [isLoaded, cart, router])

  useEffect(() => {
    if (!Cookies.get('userAddress')) {
      router.push('/checkout/address')
    }
  }, [router])

  if (!shippingAddress || !isLoaded || cart.length === 0) {
    return <></>
  }

  const {
    firstName,
    lastName,
    address,
    address2 = '',
    city,
    phone,
    zip,
    country,
  } = shippingAddress

  const onCreateOrder = async () => {
    setIsPosting(true)
    const { message, hasError } = await createOrder()
    if (hasError) {
      setIsPosting(false)
      setErrorMessage(message)
      return
    }
    setTimeout(() => {
      router.replace(`/orders/${message}`)
    }, 500)
  }

  return (
    <ShopLayout title="Resumen de Orden" pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Resumen de la Orden
      </Typography>
      <Grid container sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({itemsCount} producto{itemsCount > 1 ? 's' : ''})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega:
                </Typography>
                <NextLink href="/checkout/address" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>{`${firstName} ${lastName}`}</Typography>
              <Typography>
                {address}, {address2 ? address2 : ''}
              </Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              <Typography>
                {countries.find((c) => c.code === country)?.name}
              </Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirmar Orden
                </Button>
                {errorMessage && (
                  <Chip color="error" label={errorMessage} sx={{ mt: 2 }} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage
