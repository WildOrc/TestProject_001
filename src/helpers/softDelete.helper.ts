import { Schema } from 'mongoose';
import { ApiError } from './apiError.helper';

export default function preForSoftDelete (schema: Schema): void {
  try {

/*    schema.pre('save', function() {
      this.where({ deletedAt: null });
    });*/

    schema.pre('find', function() {
      this.where({ deletedAt: null });
    });

    schema.pre('findOne', function() {
      this.where({ deletedAt: null });
    });

    schema.pre('updateOne', function() {
      this.where({ deletedAt: null });
    });

  } catch (e: any) {
    console.error(e);
    throw new ApiError(e?.message, 501);
  }
}