import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database'

import { Order, Product, User } from '../../models'

type Data = {
  message: string
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // validation only should works on development enviroment
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({
      message: 'Acceso prohibido, contáctate con el administrador',
    })
  }

  await db.connect()

  await User.deleteMany()
  await User.insertMany(seedDatabase.initialData.users)

  await Product.deleteMany()
  await Product.insertMany(seedDatabase.initialData.products)
  await Order.deleteMany()

  await db.disconnect()

  return res.status(200).json({
    message: 'Proceso de carga realizado correctamente',
  })
}
