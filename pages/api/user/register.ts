import bcrypt from 'bcryptjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import { jwt, validators } from '../../../utils'

type Data =
  | {
      message: string
    }
  | {
      token: string
      user: {
        email: string
        name: string
        role: string
      }
    }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res)

    default:
      res.status(400).json({ message: 'Bad request' })
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let {
    email = '',
    password = '',
    name = '',
  } = req.body as { email: string; password: string; name: string }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'El password debe tener mas de 6 caracteres',
    })
  }

  if (name.length < 2) {
    return res.status(400).json({
      message: 'El nombre debe tener mas de 2 caracteres',
    })
  }

  if (!validators.isValidEmail(email)) {
    return res.status(400).json({
      message: 'Error, verificar que el email ingresado sea correcto.',
    })
  }

  await db.connect()

  const user = await User.findOne({ email: email.toLowerCase() }).lean()

  if (user) {
    await db.disconnect()
    return res.status(400).json({
      message: 'Ese  usuario ya esta registrado',
    })
  }

  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
  })

  try {
    await newUser.save({ validateBeforeSave: true })
  } catch (error) {
    return res.status(500).json({
      message: 'Check logs on server',
    })
  }

  await db.disconnect()

  const { _id, role } = newUser

  const token = jwt.signToken(_id, email)

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  })
}
