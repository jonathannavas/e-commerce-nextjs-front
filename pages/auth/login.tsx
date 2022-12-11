import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layouts'

import NextLink from 'next/link'

const LoginPage = () => {
  return (
    <AuthLayout title={'Inicio de sesión'}>
      <Box sx={{ width: '350px', padding: '10px 20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Typography variant="h1" component="h1">
              Iniciar Sesión
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Correo electrónico" variant="filled" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Contraseña" variant="filled" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              className="circular-btn"
              size="large"
              fullWidth
            >
              Ingresar
            </Button>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="end">
            <NextLink href="/auth/register" passHref legacyBehavior>
              <Link underline="always">No tienes cuenta?</Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  )
}

export default LoginPage
