import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Grid,
  Link,
  Typography,
} from '@mui/material'
import { FC, useMemo, useState } from 'react'
import { IProduct } from '../../interfaces'

interface Props {
  product: IProduct
}

import NextLink from 'next/link'

export const ProductCard: FC<Props> = ({ product }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const productImage = useMemo(() => {
    return isHovered
      ? `/products/${product.images[1]}`
      : `/products/${product.images[0]}`
  }, [isHovered])

  return (
    <Grid
      item
      xs={6}
      sm={4}
      md={3}
      onMouseEnter={() => {
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
    >
      <Card>
        <NextLink
          href={`/product/${product.slug}`}
          passHref
          prefetch={false}
          legacyBehavior
        >
          <Link>
            <CardActionArea>
              {product.inStock <= 0 && (
                <Chip
                  color="warning"
                  label="Próximamente"
                  sx={{
                    position: 'absolute',
                    zIndex: 99,
                    top: '10px',
                    right: '10px',
                  }}
                />
              )}
              <CardMedia
                component="img"
                className="fadeIn"
                image={productImage}
                alt={`${product.title}`}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>

      <Box sx={{ mt: 1 }} className="fadeIn">
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>${product.price}</Typography>
      </Box>
    </Grid>
  )
}
