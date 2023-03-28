import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateOrderInput {
  @IsNotEmpty()
  @Field(() => String)
  _id: string;

  @MinLength(2, {
    message: 'Guest name must be at least 2 characters',
  })
  @MaxLength(50, {
    message: 'Guest name must not be more than 50 characters',
  })
  @IsOptional()
  @Field(() => String, { nullable: true })
  guestName?: string;

  @Length(11)
  @IsOptional()
  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  expectedArrivalTime?: Date;

  @IsInt()
  @IsOptional()
  @Min(1, {
    message: 'Table size must be great than 0',
  })
  @Max(50, {
    message: 'Table size must be less than 50',
  })
  @Field(() => Int, {
    nullable: true,
    description: 'Table size must not be great than 50 and not be 0',
  })
  reservedTableSize?: number;
}
