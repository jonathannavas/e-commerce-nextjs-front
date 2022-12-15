import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { GetServerSideProps } from 'next'
import { FC } from 'react'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces'

interface Props {
  products: IProduct[]
  term: string
  foundProducts: boolean
}

const SearchPage: FC<Props> = ({ products, term, foundProducts }) => {
  return (
    <ShopLayout
      title="Teslo-Shop - Búsqueda de productos"
      pageDescription={'Encuentra los mejores productos aqui'}
    >
      <Typography variant="h1" component="h1">
        Buscar producto
      </Typography>
      {foundProducts ? (
        <Typography variant="h2" sx={{ mb: 5 }} textTransform="capitalize">
          Término: {term}
        </Typography>
      ) : (
        <Box
          display="flex"
          sx={{ flexDirection: { xs: 'column', sm: 'row' }, mb: 5 }}
        >
          <Typography variant="h2">
            No se encontraron resultados, sin embargo también tenemos productos
            que podrían ser de tu interés.
          </Typography>
          <Box display="flex" sx={{ mt: { xs: 2, sm: 0 } }}>
            <Typography variant="h2" sx={{ ml: { xs: 0, sm: 2 } }}>
              Término:
            </Typography>
            <Typography
              variant="h2"
              sx={{ ml: { xs: 1 } }}
              color="secondary"
              textTransform="capitalize"
            >
              {term}
            </Typography>
          </Box>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string }

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  let products = await dbProducts.getProductsByTerm(query)
  //TODO: Retornar productos similares en caso de no encontrar resultados
  const foundProducts = products.length > 0
  if (!foundProducts) {
    // products = await dbProducts.getAllProducts()
    products = await dbProducts.getProductsByTerm('shirt')
  }

  return {
    props: {
      products,
      foundProducts,
      term: query,
    },
  }
}
export default SearchPage
