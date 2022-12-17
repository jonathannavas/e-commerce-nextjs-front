import {
  Box,
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { FC, useContext, useEffect, useState } from 'react'
import { CartContext } from '../../context'
import { ICartProduct } from '../../interfaces'
import { ItemCounter } from '../ui'

interface Props {
  editable?: boolean
}

export const CartList: FC<Props> = ({ editable = false }) => {
  const { cart, updateCartProductQuantity, removeCartProduct } =
    useContext(CartContext)

  const router = useRouter()
  if (cart.length === 0) {
    router.push('/cart/empty')
    return null
  }

  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const onNewCartQuantityValue = (
    product: ICartProduct,
    newQuantityValue: number
  ) => {
    product.quantity = newQuantityValue
    updateCartProductQuantity(product)
  }
  return (
    <>
      {hasMounted &&
        cart.map((product: ICartProduct) => {
          return (
            <Grid
              container
              spacing={2}
              key={product.slug + product.size}
              sx={{ mb: 1 }}
            >
              <Grid item xs={3} sm={3} md={3} lg={3}>
                {/* TODO: LLEVAR A LA PAGINA DEL SITIO DEL PRODUCTO */}
                <NextLink
                  href={`/product/${product.slug}`}
                  passHref
                  legacyBehavior
                >
                  <Link>
                    <CardActionArea>
                      <CardMedia
                        image={`/products/${product.images}`}
                        component="img"
                        sx={{ borderRadius: '5px' }}
                      />
                    </CardActionArea>
                  </Link>
                </NextLink>
              </Grid>
              <Grid item xs={7} sm={6} md={5} lg={6}>
                <Box display="flex" flexDirection="column">
                  <NextLink
                    href={`/product/${product.slug}`}
                    passHref
                    legacyBehavior
                  >
                    <Link>
                      <Typography variant="body1">{product.title}</Typography>
                    </Link>
                  </NextLink>

                  <Typography variant="body1">
                    Talla: <strong>{product.size}</strong>
                  </Typography>
                  {editable ? (
                    <ItemCounter
                      currentValue={product.quantity}
                      maxValue={10}
                      updatedQuantity={(value) =>
                        onNewCartQuantityValue(product, value)
                      }
                    />
                  ) : (
                    <Typography variant="h6">
                      {product.quantity} producto
                      {product.quantity > 1 ? 's' : ''}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid
                item
                xs={2}
                sm={2}
                md={2}
                lg={2}
                display="flex"
                alignItems="center"
                flexDirection="column"
              >
                <Typography variant="subtitle1">${product.price}</Typography>
                {editable && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => removeCartProduct(product)}
                  >
                    Remover
                  </Button>
                )}
              </Grid>
            </Grid>
          )
        })}
    </>
  )
}
