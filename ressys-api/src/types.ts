import { Request, Response } from 'express';
import { OrderStatus } from './models/order.model';
import { User } from './models/user.model';

export interface Context {
  req: Request;
  res: Response;
  user?: User;
}

export interface OrderFilterData {
  user?: { _id: string };
  _id?: string;
  expectedArrivalTime?: { $gte?: Date; $lte?: Date };
  status?: OrderStatus;
}
