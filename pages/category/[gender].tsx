import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { SkeletonProducts } from '../../components/ui'
import { useProducts } from '../../hooks'

const handleMessageTitle = (gender: string, type?: string) => {
  switch (gender) {
    case 'men':
      return type === 'title' ? 'Teslo-Shop - Hombres' : 'Categoría: Hombres'
    case 'women':
      return type === 'title' ? 'Teslo-Shop - Mujeres' : 'Categoría: Mujeres'
    case 'kid':
      return type === 'title' ? 'Teslo-Shop - Niños' : 'Categoría: Niños'
    default:
      return type === 'title' ? 'Teslo-Shop - Ecommerce' : 'Todos los productos'
  }
}

const CategoryGenderPage = () => {
  const router = useRouter()
  let { gender = 'all' } = router.query
  gender = gender.toString().toLowerCase()
  const { products, isError, isLoading } = useProducts(
    `/products?gender=${gender}`
  )

  return (
    <ShopLayout
      title={`${handleMessageTitle(gender, 'title')}`}
      pageDescription={`${handleMessageTitle(gender, 'title')}`}
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 5 }}>
        {`${handleMessageTitle(gender)}`}
      </Typography>
      {isLoading ? <SkeletonProducts /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

export default CategoryGenderPage
