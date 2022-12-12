import { Grid, Typography } from '@mui/material'

export const OrderSummary = () => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>3 productos</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>${`${155.32}`}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>IVA 12%</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{`$${15.32}`}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total: </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Typography variant="subtitle1">
          <strong>{`$${170.64}`}</strong>
        </Typography>
      </Grid>
    </Grid>
  )
}
