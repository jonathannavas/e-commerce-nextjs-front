import { Box, IconButton, Typography } from '@mui/material'
import { FC } from 'react'

import AddCircleOutline from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline'

interface Props {
  currentValue: number
  maxValue?: number
  updatedQuantity: (newValue: number) => void
}

export const ItemCounter: FC<Props> = ({
  currentValue,
  updatedQuantity,
  maxValue = 5,
}) => {
  const handleCurrentValue = (value: number) => {
    if (value === -1) {
      if (currentValue === 1) return
      return updatedQuantity(currentValue - 1)
    }

    if (currentValue >= maxValue) return
    updatedQuantity(currentValue + 1)
  }
  return (
    <Box display="flex" alignItems="center">
      <IconButton
        onClick={() => {
          handleCurrentValue(-1)
        }}
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>
        {currentValue}
      </Typography>
      <IconButton
        onClick={() => {
          handleCurrentValue(1)
        }}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
