import { Grid, Typography } from '@mui/material'
import { useContext } from 'react'
import { CartContext } from '../../context/'
import { currency } from '../../utils'

export const OrderSummary = () => {
  const { itemsCount, subTotal, tax, total } = useContext(CartContext)

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>
          {itemsCount} producto{itemsCount > 0 ? 's' : ''}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{currency.format(subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          IVA ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100})%
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{currency.format(tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total: </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Typography variant="subtitle1">
          <strong>{currency.format(total)}</strong>
        </Typography>
      </Grid>
    </Grid>
  )
}
