import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import * as jwt from '../common/jwt';
import { UserModel } from '../models/user.model';
import { AuthPayload } from '../resolvers/types/auth.payload';
import { LoginWithEmailInput } from '../resolvers/types/loginWithEmail.input';

export class AuthService {
  async loginWithEmail(input: LoginWithEmailInput): Promise<AuthPayload> {
    const user = await UserModel.findOne({ email: input.email }).lean();

    if (!user) {
      throw new GraphQLError('Invalid email or password');
    }

    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new GraphQLError('Invalid email or password');
    }

    const payload = new AuthPayload();
    payload.user = user;
    payload.token = await jwt.sign({ sub: user._id.toString() });

    return payload;
  }
}
