import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material'

import ErrorOutline from '@mui/icons-material/ErrorOutline'

import { AuthLayout } from '../../components/layouts'

import { GetServerSideProps } from 'next'
import { getSession, signIn } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../context'
import { validators } from '../../utils'

type FormData = {
  email: string
  password: string
  name: string
}

const RegisterPage = () => {
  const router = useRouter()
  const { handleRegisterUser } = useContext(AuthContext)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onRegisterForm = async ({ email, password, name }: FormData) => {
    setShowError(false)

    const resp = await handleRegisterUser(name, email, password)

    if (resp.hasError) {
      setShowError(true)
      setErrorMessage(resp.message || '')
      setTimeout(() => {
        setShowError(false)
      }, 3000)
      return
    }

    // const destination = router.query.p?.toString() || '/'

    // router.replace(destination)

    await signIn('credentials', { email, password })
  }

  return (
    <AuthLayout title={'Crear cuenta'}>
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: '350px', padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              <Typography variant="h1" component="h1">
                Crear cuenta
              </Typography>
              {showError && (
                <Chip
                  label={errorMessage}
                  color="error"
                  icon={<ErrorOutline />}
                  className="fadeIn"
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre completo"
                type="text"
                {...register('name', {
                  required: 'Este campo es requerido',
                  minLength: {
                    value: 2,
                    message: 'Usar al menos 2 caracteres',
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo electrónico"
                {...register('email', {
                  required: 'Este campo es requerido',
                  validate: (email) => validators.isEmail(email),
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                label="Contraseña"
                variant="filled"
                fullWidth
                {...register('password', {
                  required: 'Este campo es requerido',
                  minLength: {
                    value: 6,
                    message: 'Usar al menos 6 caracteres',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
                type="submit"
                disabled={showError}
              >
                Registrarse
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={
                  router.query.p
                    ? `/auth/login?p=${router.query.p}`
                    : '/auth/login'
                }
                passHref
                legacyBehavior
              >
                <Link underline="always">Ya tienes una cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req })
  const { p = '/' } = query
  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}

export default RegisterPage
