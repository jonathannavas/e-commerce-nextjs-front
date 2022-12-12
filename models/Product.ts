import mongoose, { model, Model, Schema } from 'mongoose'
import { IProduct } from '../interfaces'

const productSchema = new Schema(
  {
    description: { type: String, required: true },
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [
      {
        type: String,
        enum: {
          values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
          message: `{VALUE} No es un valor permitido`,
        },
      },
    ],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String, required: true }],
    title: { type: String, required: true },
    type: [
      {
        type: String,
        enum: {
          values: ['shirts', 'pants', 'hoodies', 'hats'],
          message: `{VALUE} No es un tipo permitido`,
        },
      },
    ],
    gender: {
      type: String,
      enum: {
        values: ['men', 'women', 'kid', 'unisex'],
        message: `{VALUE} No es un genero permitido`,
      },
    },
  },
  {
    timestamps: true,
  }
)

//TODO: Crear indice de mongo

productSchema.index({ title: 'text', tags: 'text' })

const Product: Model<IProduct> =
  mongoose.models.Product || model('Product', productSchema)

export default Product
