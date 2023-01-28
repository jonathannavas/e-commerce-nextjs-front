import AirplaneTicketOutlined from '@mui/icons-material/AirplaneTicketOutlined'
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined'
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined'
import CreditScoreOutlined from '@mui/icons-material/CreditScoreOutlined'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { CartList, OrderSummary } from '../../../components/cart'
import { AdminLayout } from '../../../components/layouts'
import { dbOrders } from '../../../database'
import { IOrder } from '../../../interfaces'

interface Props {
  order: IOrder
}

const OrderResume = ({ order }: Props) => {
  const { _id, itemsCount, isPaid, shippingAddress, subTotal, total, tax } =
    order

  const orderValues = { subTotal, total, tax, itemsCount }

  return (
    <AdminLayout
      title="Resumen de la orden"
      subTitle={'Orden ID: #' + _id}
      icon={<AirplaneTicketOutlined />}
    >
      {isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden pagada"
          variant="outlined"
          color="success"
          icon={<CreditCardOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container sx={{ mt: 2 }} className="fadeIn">
        <Grid item xs={12} sm={6} md={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({`${itemsCount} producto${itemsCount > 1 ? 's' : ''}`})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega:
                </Typography>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.address}
                {shippingAddress.address2
                  ? `, ${shippingAddress.address2}`
                  : ''}
              </Typography>

              <Typography>
                {shippingAddress.city}, {shippingAddress.zip}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary orderValues={orderValues} />

              <Box sx={{ mt: 3 }} display="flex" flexDirection={'column'}>
                <Box sx={{ display: 'flex', flex: 1 }} flexDirection="column">
                  {isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Orden pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <Chip
                      sx={{ my: 2 }}
                      label="Orden pendiente de pago"
                      variant="outlined"
                      color="error"
                      icon={<CreditCardOffOutlined />}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = '' } = query
  const session: any = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=orders/${id}`,
        permanent: false,
      },
    }
  }

  const order = await dbOrders.orderById(id.toString())
  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      order,
    },
  }
}

export default OrderResume
