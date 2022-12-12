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

const SummaryPage = () => {
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
