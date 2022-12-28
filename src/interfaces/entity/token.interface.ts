import { ObjectId } from "mongoose";

export interface IToken {
  _id?: ObjectId;
  accessToken: String;
  refreshToken: String;
  createdAt: Number;
  updatedAt: Number;
  isRevoked?: Boolean;
}