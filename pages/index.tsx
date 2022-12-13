import { Typography } from '@mui/material'
import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products'
import { SkeletonProducts } from '../components/ui'
import { useProducts } from '../hooks'

export default function HomePage() {
  const { products, isError, isLoading } = useProducts('/products')

  return (
    <ShopLayout
      title="E-commerce"
      pageDescription={'Encuentra los mejores productos aqui'}
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 5 }}>
        Todos los productos
      </Typography>
      {isLoading ? <SkeletonProducts /> : <ProductList products={products} />}
    </ShopLayout>
  )
}
