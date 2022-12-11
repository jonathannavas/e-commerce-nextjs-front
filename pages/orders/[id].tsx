import {
  Box,
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

import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined'

import NextLink from 'next/link'

const OrderPage = () => {
  return (
    <ShopLayout
      title="Resumen de la Orden #234567"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden: #234567
      </Typography>

      {/* <Chip
        sx={{ my: 2 }}
        label="Pendiente de pago"
        variant="outlined"
        color="error"
        icon={<CreditCardOffOutlined />}
      /> */}

      <Chip
        sx={{ my: 2 }}
        label="Orden pagada"
        variant="outlined"
        color="success"
        icon={<CreditCardOutlined />}
      />

      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen (4 productos)</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega:
                </Typography>
                <NextLink href="/checkout/address" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>Jonathan Navas</Typography>
              <Typography>Av. Simon Bolivar </Typography>
              <Typography>Ciudad Jardín MZ-10</Typography>
              <Typography>Quito</Typography>
              <Typography>+593 0982329901</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <h1>Pagar</h1>
                <Chip
                  sx={{ my: 2 }}
                  label="Orden pagada"
                  variant="outlined"
                  color="success"
                  icon={<CreditCardOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default OrderPage
