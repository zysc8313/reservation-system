import { Arg, Mutation, Resolver } from 'type-graphql';
import { AuthService } from '../services/auth.service';
import { AuthPayload } from './types/auth.payload';
import { LoginWithEmailInput } from './types/loginWithEmail.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {
    this.authService = new AuthService();
  }

  @Mutation(() => AuthPayload)
  login(@Arg('input', () => LoginWithEmailInput) input: LoginWithEmailInput) {
    return this.authService.loginWithEmail(input);
  }
}
