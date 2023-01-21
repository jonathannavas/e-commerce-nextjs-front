import { Grid, Typography } from '@mui/material'
import { FC, useContext } from 'react'
import { CartContext } from '../../context/'
import { currency } from '../../utils'

interface Props {
  orderValues?: {
    itemsCount: number
    subTotal: number
    tax: number
    total: number
  }
}

export const OrderSummary: FC<Props> = ({ orderValues }: Props) => {
  const { itemsCount, subTotal, tax, total } = useContext(CartContext)

  const summaryValues = orderValues
    ? orderValues
    : { itemsCount, subTotal, tax, total }

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>
          {summaryValues.itemsCount} producto
          {summaryValues.itemsCount > 0 ? 's' : ''}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{currency.format(summaryValues.subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          IVA ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100})%
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{currency.format(summaryValues.tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total: </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Typography variant="subtitle1">
          <strong>{currency.format(summaryValues.total)}</strong>
        </Typography>
      </Grid>
    </Grid>
  )
}
