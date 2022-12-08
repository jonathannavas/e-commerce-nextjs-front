import { Typography } from '@mui/material'
import { ShopLayout } from '../components/layouts'
export default function Home() {
  return (
    <ShopLayout
      title="E-commerce"
      pageDescription={'Encuentra los mejores productos aqui'}
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" component="h2" sx={{ mv: 1 }}>
        Todos los productos
      </Typography>
    </ShopLayout>
  )
}
