import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'

import NextLink from 'next/link'
import { useContext } from 'react'
import { CartContext } from '../../context/cart/CartContext'
import { countries } from '../../utils'

const SummaryPage = () => {
  const { shippingAddress, itemsCount } = useContext(CartContext)

  if (!shippingAddress) {
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

              <Box sx={{ mt: 3 }}>
                <Button color="secondary" className="circular-btn" fullWidth>
                  Confirmar Orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage
