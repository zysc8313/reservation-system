import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginWithEmailInput {
  @IsEmail({}, { message: 'Invalid email format' })
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
