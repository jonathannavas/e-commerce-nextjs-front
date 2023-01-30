import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'

import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined'
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined'
import CreditScoreOutlined from '@mui/icons-material/CreditScoreOutlined'

import { PayPalButtons } from '@paypal/react-paypal-js'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import tesloApi from '../../axiosApi/tesloApi'
import { dbOrders } from '../../database'
import { IOrder } from '../../interfaces/order'

interface Props {
  order: IOrder
}

export type OrderResponseBody = {
  id: string
  status:
    | 'COMPLETED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'PAYER_ACTION_REQUIRED'
}

const OrderPage: NextPage<Props> = ({ order }: Props) => {
  const router = useRouter()
  const [isPaying, setIsPaying] = useState(false)
  const { _id, itemsCount, isPaid, shippingAddress, subTotal, total, tax } =
    order
  const orderValues = { subTotal, total, tax, itemsCount }

  const onOrderCompleted = async (details: OrderResponseBody) => {
    const { status } = details
    if (status !== 'COMPLETED') {
      return alert('No hay pago en paypal')
    }

    setIsPaying(true)

    try {
      const { data } = await tesloApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id,
      })

      router.reload()
    } catch (error) {
      setIsPaying(false)
      console.log(error)
      alert(error)
    }
  }

  return (
    <ShopLayout
      title={`Resumen de la Orden # ${_id}`}
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden: #{_id}
      </Typography>

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
                <Box
                  display="flex"
                  justifyContent="center"
                  className="fadeIn"
                  sx={{ display: isPaying ? 'flex' : 'none' }}
                >
                  <CircularProgress />
                </Box>

                <Box
                  sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
                  flexDirection="column"
                >
                  {isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Orden pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <>
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: order.total.toString(),
                                },
                              },
                            ],
                          })
                        }}
                        onApprove={(data, actions) => {
                          return actions.order!.capture().then((details) => {
                            onOrderCompleted(details)
                          })
                        }}
                      />
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
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
        destination: `/orders/history`,
        permanent: false,
      },
    }
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
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

export default OrderPage
