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
import { FC } from 'react'
import { initialData } from '../../database/products'
import { ItemCounter } from '../ui'

interface Props {
  editable?: boolean
}

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
  initialData.products[3],
]

export const CartList: FC<Props> = ({ editable = false }) => {
  return (
    <>
      {productsInCart.map((product: any) => {
        return (
          <Grid container spacing={2} key={product.slug} sx={{ mb: 1 }}>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              {/* TODO: LLEVAR A LA PAGINA DEL SITIO DEL PRODUCTO */}
              <NextLink href="/product/slug" passHref legacyBehavior>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={`/products/${product.images[0]}`}
                      component="img"
                      sx={{ borderRadius: '5px' }}
                    />
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>
            <Grid item xs={7} sm={6} md={5} lg={6}>
              <Box display="flex" flexDirection="column">
                <Typography variant="body1">{product.title}</Typography>
                <Typography variant="body1">
                  Talla: <strong>M</strong>
                </Typography>
                {editable ? (
                  <ItemCounter />
                ) : (
                  <Typography variant="h6">3 items</Typography>
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
                <Button variant="text" color="error">
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
