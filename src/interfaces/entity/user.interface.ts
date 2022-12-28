import { IStatusesRow } from '../lego/statusesRow.interface';
import { ObjectId } from 'mongoose';

export interface IUser extends IStatusesRow{
  _id?: ObjectId;
  firstName: String;
  lastName: String;
  email: String;
  phoneNumber: String;
  login: String;
  password: String;
  isActive?: Boolean;
}