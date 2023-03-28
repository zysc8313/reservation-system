import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { User } from '../models/user.model';
import { Context } from '../types';

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => User)
  me(@Ctx() { user }: Context) {
    return user;
  }
}
