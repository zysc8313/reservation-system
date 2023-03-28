import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Field, Int, ObjectType, registerEnumType } from 'type-graphql';
import { User } from './user.model';

export enum OrderStatus {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
export class Order {
  @Field(() => String)
  readonly _id: string;

  @Field(() => User, { nullable: true })
  @prop({ type: String, ref: User })
  user?: Ref<User>;

  @Field(() => String)
  @prop({ type: String, required: true })
  guestName: string;

  @Field(() => String)
  @prop({ type: String, required: true })
  phoneNumber: string;

  @Field(() => Date)
  @prop({ type: Date, required: true })
  expectedArrivalTime: Date;

  @Field(() => Int)
  @prop({ type: Number, required: true })
  reservedTableSize: number;

  @Field(() => OrderStatus)
  @prop({
    type: String,
    required: true,
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;
}

export const OrderModel = getModelForClass(Order);
