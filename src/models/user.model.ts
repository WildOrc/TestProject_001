import mongoose, { Schema } from 'mongoose';
import preForSoftDelete from '../helpers/softDelete.helper';
import { IUser } from '../interfaces/entity/user.interface';

const UserSchema = new Schema<Omit<IUser, '_id'>>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true},
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Number, required: false },
  updatedAt: { type: Number, required: true },
  deletedAt: { type: Number, required: false, default: null },
  isActive: { type: Number, required: false, default: true },
});

preForSoftDelete(UserSchema);
export const UserModel = mongoose.model('User', UserSchema);