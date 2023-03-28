import { Field, ObjectType } from 'type-graphql';
import { User } from '../../models/user.model';

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token: string;

  @Field(() => User)
  user: User;
}
