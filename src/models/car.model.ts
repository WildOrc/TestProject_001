import { ICar } from 'src/interfaces/entity/car.interface';
import mongoose, { Schema } from 'mongoose';
import preForSoftDelete from '../helpers/softDelete.helper';

const CarSchema = new Schema<Omit<ICar, '_id'>>({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Number, required: false },
  updatedAt: { type: Number, required: true },
  deletedAt: { type: Number, required: false, default: null },
});

preForSoftDelete(CarSchema);
export const CarModel = mongoose.model('Car', CarSchema);