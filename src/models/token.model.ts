import mongoose, { Schema, Types } from 'mongoose';
import preForSoftDelete from '../helpers/softDelete.helper';
import { IToken } from '../interfaces/entity/token.interface';

const TokenSchema = new Schema<Omit<IToken, '_id'>>({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Number, required: false },
  updatedAt: { type: Number, required: true },
  isRevoked: { type: Number, required: false, default: false },
});

preForSoftDelete(TokenSchema);
export const TokenModel = mongoose.model('Token', TokenSchema);