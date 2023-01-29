import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { ShopLayout } from '../../components/layouts'
import { ProductSlideshow, SizeSelector } from '../../components/products'
import { ItemCounter } from '../../components/ui'
import { CartContext } from '../../context'
import { dbProducts } from '../../database'
import { ICartProduct, IProduct, ISize } from '../../interfaces'

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const { addProductToCart } = useContext(CartContext)
  const router = useRouter()

  const [productBySlug, setProductBySlug] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const onSelectedSize = (size: ISize) => {
    setProductBySlug((currentProduct) => ({
      ...currentProduct,
      size,
    }))
  }

  const updatedQuantity = (newValue: number) => {
    setProductBySlug((currentProduct) => ({
      ...currentProduct,
      quantity: newValue,
    }))
  }

  const addToCart = () => {
    if (!productBySlug.size) return
    addProductToCart(productBySlug)
    router.push('/cart')
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          {/* slideshow */}
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          {/* product description */}
          <Box display={'flex'} flexDirection={'column'}>
            {/* titulos */}
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>
            {/* cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              {/* ItemCounter */}
              <ItemCounter
                currentValue={productBySlug.quantity}
                updatedQuantity={updatedQuantity}
                maxValue={product.inStock > 10 ? 5 : product.inStock}
              />
              <SizeSelector
                selectedSize={productBySlug.size}
                sizes={product.sizes}
                onSelectedSize={onSelectedSize}
              />
            </Box>
            {/* Agregar al carrito */}

            {product.inStock > 0 ? (
              <Button
                color={'secondary'}
                className="circular-btn"
                onClick={addToCart}
              >
                {productBySlug.size
                  ? 'Agregar al carrito'
                  : 'Seleccione una talla'}
              </Button>
            ) : (
              <Chip
                label="No está disponible"
                color="error"
                variant="outlined"
              />
            )}

            {/* description */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2" textAlign={'justify'}>
                {product.description}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// USAR ESTO SI Y SOLO SI SE REQUIERE TRAER SIEMPRE LA DATA POR PARTE DEL SERVIDOR
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = '' } = params as { slug: string }

//   const product = await dbProducts.getProductsBySlug(slug)
//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }
//   return {
//     props: {
//       product,
//     },
//   }
// }

// SI LO QUE QUEREMOS ES QUE SE PAREZCA A UDEMY CON RESPECTO A LA INFORMACION AHI SI DEBEMOS USAR LO QUE TENEMOS ABAJO

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductsSlugs()
  const urls: string[] = slugs.map((s) => s.slug)

  return {
    paths: urls.map((slug) => ({
      params: {
        slug,
      },
    })),
    fallback: 'blocking',
  }
}

// O TAMBIEN PUEDE SER ARMADO DE LA SIGUIENTE FORMA MAS CORTA
// export const getStaticPaths: GetStaticPaths = async (ctx) => {
//   const productsSlugs = await dbProducts.getAllProductsSlugs()

//   return {
//     paths: productsSlugs.map(({slug})=> {
//       params: {
//         slug
//       }
//     }),
//     fallback: 'blocking',
//   }
// }

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string }
  const product = await dbProducts.getProductsBySlug(slug)
  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  //  60 * 60 * 24 = 86400
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 0.25, //el servidor va a revalidar la informacion cada 24 horas
  }
}

export default ProductPage
