import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { db } from '../../../database'
import { IOrder } from '../../../interfaces'
import { Order, Product } from '../../../models'

type Data =
  | {
      message: string
    }
  | IOrder

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res)

    default:
      return res.status(400).json({ message: 'Bad request' })
  }
}
const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // check session first
  const session: any = await getSession({ req })
  if (!session) {
    return res.status(401).json({
      message: 'Get login before create an order',
    })
  }

  const { orderItems, total } = req.body as IOrder
  // create an array with all the products
  const productsIds = orderItems.map((product) => product._id)

  await db.connect()

  const dbProducts = await Product.find({ _id: { $in: productsIds } })

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (prod: any) => prod.id === current._id
      )?.price
      if (!currentPrice) {
        throw new Error('Verifique, su carrito el producto no existe')
      }
      return currentPrice * current.quantity + prev
    }, 0)

    const taxRate: number = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
    const totalBack = subTotal * (taxRate + 1)

    if (total !== totalBack) {
      throw new Error('El total no cuadra con el monto')
    }

    // TODO: Todo bien hasta el momento
    const userId = session.user._id
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId })

    await newOrder.save()
    await db.disconnect()

    return res.status(201).json(newOrder)
  } catch (error: any) {
    await db.disconnect()
    console.log(error)
    return res.status(400).json({
      message: error.message || 'Revisar logs en el servidor',
    })
  }
}
