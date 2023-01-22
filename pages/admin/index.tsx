import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined'
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined'
import CancelPresentationOutlined from '@mui/icons-material/CancelPresentationOutlined'
import CategoryOutlined from '@mui/icons-material/CategoryOutlined'
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined'
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import GroupOutlined from '@mui/icons-material/GroupOutlined'
import ProductionQuantityLimitsOutlined from '@mui/icons-material/ProductionQuantityLimitsOutlined'

import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { SummaryTile } from '../../components/admin'
import { AdminLayout } from '../../components/layouts/AdminLayout'
import { DashboardSummaryResponse } from '../../interfaces'

// interface Props {
//   data: string
// }

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    '/api/admin/dashboard',
    {
      refreshInterval: 30 * 1000,
    }
  )
  const [refreshIn, setRefreshIn] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!error && !data) {
    return <></>
  }

  if (error) {
    return <Typography>Error al cargar la información</Typography>
  }

  const {
    notPaidOrders,
    numberOfClients,
    numberOfOrders,
    numberOfProducts,
    paidOrders,
    productsWithLowStock,
    productsWithNoStock,
  }: DashboardSummaryResponse = data!

  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Página de administración"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subTitle="Órdenes totales"
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={paidOrders}
          subTitle="Órdenes pagadas"
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={notPaidOrders}
          subTitle="Órdenes pendientes"
          icon={<CreditCardOffOutlined color="warning" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfClients}
          subTitle="Clientes"
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfProducts}
          subTitle="Productos"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={productsWithNoStock}
          subTitle="Productos sin stock"
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />

        <SummaryTile
          title={productsWithLowStock}
          subTitle="Productos con bajo stock"
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
        />

        <SummaryTile
          title={refreshIn}
          subTitle="Actualización en"
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  )
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   return {
//     props: {
//       data: 'hola data',
//     },
//   }
// }

export default DashboardPage
