import { IStatusesRow } from '../lego/statusesRow.interface';
import { ObjectId } from 'mongoose';
export interface ICar extends IStatusesRow{
  _id?: ObjectId;
  brand: String;
  model: String;
  year: Number;
  price: Number;
}