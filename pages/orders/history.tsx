import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import NextLink from 'next/link'
import { ShopLayout } from '../../components/layouts/ShopLayout'

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
        <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
          <Link underline="always">Ver Orden</Link>
        </NextLink>
      )
    },
  },
]

const rows = [
  { id: 1, paid: false, fullname: 'Jonathan Navas' },
  { id: 2, paid: true, fullname: 'Gabriel Navas' },
  { id: 3, paid: false, fullname: 'Fernando Herrera' },
  { id: 4, paid: false, fullname: 'Jordy Navas' },
  { id: 5, paid: false, fullname: 'Alexander Navas' },
  { id: 6, paid: true, fullname: 'Kevin Navas' },
  { id: 7, paid: false, fullname: 'Gabriel Navas' },
]

const HistoryPage = () => {
  return (
    <ShopLayout
      title={'Historial de Órdenes'}
      pageDescription={'Historial de Órdenes del Cliente'}
    >
      <Typography variant="h1" component="h1">
        Historial de Órdenes
      </Typography>
      <Grid container sx={{ mt: 2 }}>
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

export default HistoryPage
