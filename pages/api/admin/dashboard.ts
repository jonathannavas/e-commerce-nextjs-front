import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Order, Product, User } from '../../../models'

type Data = {
  numberOfOrders: number
  paidOrders: number
  notPaidOrders: number
  numberOfClients: number
  numberOfProducts: number
  productsWithNoStock: number
  productsWithLowStock: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db.connect()

  const [orders, users, products] = await Promise.all([
    Order.find({}),
    User.find({}),
    Product.find({}),
  ])

  await db.disconnect()

  const paidOrders = orders.filter((order) => {
    return order.isPaid === true
  }).length

  const numberOfClients = users.filter((user) => {
    return user.role === 'client'
  }).length

  const productsWithNoStock = products.filter((product) => {
    return product.inStock === 0
  }).length

  const productsWithLowStock = products.filter((product) => {
    return product.inStock >= 10
  }).length

  const response = {
    numberOfOrders: orders.length,
    paidOrders: paidOrders,
    notPaidOrders: orders.length - paidOrders,
    numberOfClients,
    numberOfProducts: products.length,
    productsWithNoStock,
    productsWithLowStock,
  }

  res.status(200).json(response)
}
