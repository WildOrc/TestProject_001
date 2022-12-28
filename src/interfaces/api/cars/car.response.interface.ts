import { ICar } from '../../entity/car.interface';

export interface ICarResponse extends Omit<ICar,'_id'>{

}