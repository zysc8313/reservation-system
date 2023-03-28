import { AuthCheckerInterface, ResolverData } from 'type-graphql';
import { Context } from '../types';

export class AuthChecker implements AuthCheckerInterface<Context> {
  check(
    { context: { user } }: ResolverData<Context>,
    roles: string[]
  ): boolean | Promise<boolean> {
    if (!user) {
      return false;
    }

    if (roles.length === 0 || (user.role && roles.includes(user.role))) {
      return true;
    }

    return false;
  }
}
