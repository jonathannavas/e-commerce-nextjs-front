import AddOutlined from '@mui/icons-material/AddOutlined'
import CategoryOutlined from '@mui/icons-material/CategoryOutlined'
import { Box, Button, CardMedia, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import NextLink from 'next/link'
import useSWR from 'swr'
import { AdminLayout } from '../../components/layouts/AdminLayout'
import { IProduct } from '../../interfaces/products'
import { format } from '../../utils/currency'

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Imagen del Producto',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia
            component={'img'}
            className="fadeIn"
            image={row.img}
            alt={row.title}
          />
        </a>
      )
    },
  },
  {
    field: 'title',
    headerName: 'Nombre producto',
    width: 300,
    align: 'center',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} legacyBehavior passHref>
          <Link underline="always">{row.title}</Link>
        </NextLink>
      )
    },
  },
  { field: 'gender', headerName: 'Genero' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Stock' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas', width: 150 },
]

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products')

  if (!data && !error) return <></>

  const rows = data!.map((product: any) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: format(product.price),
    sizes: product.sizes.join(', '),
    slug: product.slug,
  }))

  return (
    <AdminLayout
      title={`Productos ${data?.length} `}
      subTitle="Mantenimiento de Productos"
      icon={<CategoryOutlined />}
    >
      <Box display={'flex'} justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/products/new"
        >
          Crear producto
        </Button>
      </Box>
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

export default ProductsPage
