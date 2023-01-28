import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined'
import { Chip, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useSWR from 'swr'
import { AdminLayout } from '../../components/layouts/AdminLayout'
import { IOrder, IUser } from '../../interfaces'
import { format } from '../../utils/currency'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden Id', width: 250, align: 'center' },
  { field: 'email', headerName: 'Correo', width: 250, align: 'center' },
  { field: 'name', headerName: 'Nombre completo', width: 150, align: 'center' },
  { field: 'total', headerName: 'Total', width: 100 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      )
    },
    width: 150,
    align: 'center',
  },
  { field: 'noProducts', headerName: 'No. products', align: 'center' },
  { field: 'createdAt', headerName: 'Creada en', width: 250 },
  {
    field: 'check',
    headerName: 'Ver orden',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver orden
        </a>
      )
    },
  },
]

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders')

  if (!data && !error) return <></>

  const rows = data!.map((order: IOrder) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: format(order.total),
    isPaid: order.isPaid,
    noProducts: order.itemsCount,
    createdAt: new Date(order.createdAt!).toLocaleString('en-US', {
      hour12: true,
    }),
  }))

  return (
    <AdminLayout
      title="Órdenes"
      subTitle="Mantenimiento de Órdenes"
      icon={<ConfirmationNumberOutlined />}
    >
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
    </AdminLayout>
  )
}

export default OrdersPage
