import ErrorOutline from '@mui/icons-material/ErrorOutline'
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { AuthLayout } from '../../components/layouts'

import { getProviders, getSession, signIn } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../context'
import { validators } from '../../utils'

import { GetServerSideProps } from 'next'

type FormData = {
  email: string
  password: string
}

const LoginPage = () => {
  const { handleLogin } = useContext(AuthContext)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const [showError, setShowError] = useState(false)
  const [providers, setProviders] = useState<any>({})

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov)
    })
  }, [])

  const onHandleLogin = async ({ email, password }: FormData) => {
    setShowError(false)

    // autenticacion personalizada

    // const isValidLogin = await handleLogin(email, password)
    // if (!isValidLogin) {
    //   setShowError(true)
    //   setTimeout(() => {
    //     setShowError(false)
    //   }, 3000)
    //   return
    // }

    // // return to path before login prev
    // const destination = router.query.p?.toString() || '/'
    // router.replace(destination)
    await signIn('credentials', { email, password })
  }

  return (
    <AuthLayout title={'Inicio de sesión'}>
      <form onSubmit={handleSubmit(onHandleLogin)} noValidate>
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
                Iniciar Sesión
              </Typography>
              {showError && (
                <Chip
                  label="Usuario o contraseña no válidos."
                  color="error"
                  icon={<ErrorOutline />}
                  className="fadeIn"
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo electrónico"
                variant="filled"
                fullWidth
                {...register('email', {
                  required: 'Este campo es requerido',
                  validate: (email) => validators.isEmail(email),
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={
                  router.query.p
                    ? `/auth/register?p=${router.query.p}`
                    : '/auth/register'
                }
                passHref
                legacyBehavior
              >
                <Link underline="always">No tienes cuenta?</Link>
              </NextLink>
            </Grid>

            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="end"
              flexDirection="column"
            >
              <Divider sx={{ width: '100%', mb: 2 }} />
              {Object.values(providers).map((prov: any) => {
                if (prov.id === 'credentials')
                  return <div key="credentials"></div>
                return (
                  <Button
                    key={prov.id}
                    variant="outlined"
                    fullWidth
                    color="primary"
                    sx={{ mb: 1 }}
                    onClick={() => signIn(prov.id)}
                  >
                    {prov.name}
                  </Button>
                )
              })}
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

export default LoginPage
