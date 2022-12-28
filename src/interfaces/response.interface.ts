export interface IResponse <T = null> {
  data: T | null;
  statusCode: number;
}