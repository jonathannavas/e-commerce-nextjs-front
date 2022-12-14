import { Grid, Skeleton } from '@mui/material'
import { ShopLayout } from '../layouts/ShopLayout'
const arrayLength = [...Array(20)]
export const SkeletonProducts = () => {
  return (
    <ShopLayout
      title={'Cargando productos'}
      pageDescription={'Carga de Productos'}
    >
      <Grid container spacing={4}>
        {arrayLength.map((item, index) => {
          return (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Skeleton
                variant="rounded"
                width={'100%'}
                sx={{
                  height: {
                    xs: '100px',
                    sm: '220px',
                    lg: '340px',
                  },
                }}
              />
              <Skeleton variant="rounded" width="80%" sx={{ mt: 1 }} />
              <Skeleton variant="rounded" width="60%" sx={{ mt: 1 }} />
            </Grid>
          )
        })}
      </Grid>
    </ShopLayout>
  )
}
