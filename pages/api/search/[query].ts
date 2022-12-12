import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces'

import { db } from '../../../database'
import { Product } from '../../../models'

type Data = { message: string } | IProduct[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return searchProducts(req, res)

    default:
      return res.status(400).json({
        message: 'Bad request',
      })
  }
}

const searchProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let { query = '' } = req.query

  if (query.length === 0) {
    return res.status(400).json({
      message: 'Please put the query to search products',
    })
  }

  query = query.toString().toLowerCase()

  await db.connect()

  //   el select nos permite mencionar que campos requiero que me devuelva la consulta

  const products = await Product.find({
    $text: { $search: query },
  })
    .select('title images price inStock slug -_id')
    .lean()

  await db.disconnect()

  return res.status(200).json(products)
}
