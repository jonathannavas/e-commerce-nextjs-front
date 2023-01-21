import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import NextLink from 'next/link'
import { ShopLayout } from '../../components/layouts/ShopLayout'

import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrders } from '../../database'
import { IOrder } from '../../interfaces/order'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'fullname',
    headerName: 'Nombre Completo',
    width: 300,
    sortable: false,
  },
  {
    field: 'paid',
    headerName: 'Orden Pagada',
    description: 'Muestra información si la orden está pagada',
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="No pagada" variant="outlined" />
      )
    },
  },
  {
    field: 'order',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink
          href={`/orders/${params.row.orderId}`}
          passHref
          legacyBehavior
        >
          <Link underline="always">Ver Orden</Link>
        </NextLink>
      )
    },
  },
]

interface Props {
  orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, index) => {
    return {
      id: index + 1,
      paid: order.isPaid,
      fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      orderId: order._id,
    }
  })
  return (
    <ShopLayout
      title={'Historial de Órdenes'}
      pageDescription={'Historial de Órdenes del Cliente'}
    >
      <Typography variant="h1" component="h1">
        Historial de Órdenes
      </Typography>
      <Grid container sx={{ mt: 2 }} className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      },
    }
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id)

  return {
    props: {
      orders,
    },
  }
}

export default HistoryPage
