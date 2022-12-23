import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { CartContext } from '../../context'
import { countries } from '../../utils'

type FormData = {
  firstName: string
  lastName: string
  address: string
  address2?: string
  zip: string
  city: string
  country: string
  phone: string
}

const getAddressInfo = (): FormData => {
  const {
    firstName,
    address,
    lastName,
    city,
    zip,
    country,
    phone,
    address2,
  }: FormData = JSON.parse(Cookies.get('userAddress') || '[]')

  return {
    firstName,
    lastName,
    address,
    address2,
    zip,
    city,
    country,
    phone,
  }
}

const AddressPage = () => {
  const router = useRouter()
  const { updateAddress, shippingAddress } = useContext(CartContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: getAddressInfo(),
  })

  useEffect(() => {
    reset(getAddressInfo())
  }, [reset])

  const onHandleForm = (data: FormData) => {
    updateAddress(data)
    router.push('/checkout/summary')
  }

  return (
    <ShopLayout
      title={'Dirección'}
      pageDescription={'Confirmar dirección de destino'}
    >
      <form noValidate onSubmit={handleSubmit(onHandleForm)}>
        <Typography variant="h1" component="h1">
          Dirección
        </Typography>
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              type="text"
              {...register('firstName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apelido"
              variant="filled"
              fullWidth
              type="text"
              {...register('lastName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              type="text"
              {...register('address', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2"
              variant="filled"
              fullWidth
              type="text"
              {...register('address2')}
              error={!!errors.address2}
              helperText={errors.address2?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código postal"
              variant="filled"
              fullWidth
              type="text"
              {...register('zip', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              type="text"
              {...register('city', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                key={
                  shippingAddress && shippingAddress.country
                    ? shippingAddress.country
                    : countries[0].code
                }
                select
                variant="filled"
                label="Pais"
                defaultValue={
                  shippingAddress && shippingAddress.country
                    ? shippingAddress.country
                    : countries[0].code
                }
                {...register('country', {
                  required: 'Este campo es requerido',
                })}
                error={!!errors.country}
                helperText={errors.country?.message}
              >
                <MenuItem value={''}>--Seleccione el país--</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.code} key={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              type="text"
              {...register('phone', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
          <Button color="secondary" className="circular-btn" type="submit">
            Continuar
          </Button>
        </Box>
      </form>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const { token = '' } = req.cookies
//   let isValidToken = false

//   try {
//     await jwt.isValidToken(token)
//     isValidToken = true
//   } catch (error) {
//     isValidToken = false
//   }

//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: '/auth/login?p=/checkout/address',
//         permatent: false,
//       },
//     }
//   }

//   return {
//     props: {},
//   }
// }

export default AddressPage
