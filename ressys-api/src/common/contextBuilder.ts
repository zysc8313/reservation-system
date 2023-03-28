import { ContextFunction } from '@apollo/server';
import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4';
import { UserService } from '../services/user.service';
import { Context } from '../types';
import { extractUserIdFromToken, getTokenFromRequest } from './tokenHelper';

const userService = new UserService();

export const contextBuilder: ContextFunction<
  [ExpressContextFunctionArgument],
  Context
> = async ({ req, res }) => {
  let user;
  const token = getTokenFromRequest(req);
  if (token) {
    const userId = await extractUserIdFromToken(token);

    if (userId) {
      user = await userService.findById(userId);
    }
  }

  return {
    req,
    res,
    user,
  };
};
