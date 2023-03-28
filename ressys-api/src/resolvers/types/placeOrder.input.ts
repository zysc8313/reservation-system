import {
  IsDate,
  IsInt,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class PlaceOrderInput {
  @MinLength(2, {
    message: 'Guest name must be at least 2 characters',
  })
  @MaxLength(50, {
    message: 'Guest name must not be more than 50 characters',
  })
  @Field(() => String)
  guestName: string;

  @Length(11)
  @Field(() => String)
  phoneNumber: string;

  @IsDate()
  @Field(() => Date)
  expectedArrivalTime: Date;

  @IsInt()
  @Min(1, {
    message: 'Table size must be great than 0',
  })
  @Max(50, {
    message: 'Table size must be less than 50',
  })
  @Field(() => Int, {
    description: 'Table size must not be great than 50 and not be 0',
  })
  reservedTableSize: number;
}
