import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { OrderStatus } from '../../models/order.model';

@InputType()
export class OrderFilterInput {
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  startTime?: Date;

  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  endTime?: Date;

  @IsOptional()
  @Field(() => OrderStatus, { nullable: true })
  status?: OrderStatus;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  all?: boolean;
}
