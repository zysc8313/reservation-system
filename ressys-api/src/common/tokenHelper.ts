import { Request } from 'express';
import * as jwt from './jwt';

export function getTokenFromRequest(req: Request): string | undefined {
  const auth = req.get('Authorization');

  if (auth && auth?.startsWith('Bearer ')) {
    return auth?.split(' ').pop();
  }
}

export async function extractUserIdFromToken(
  token: string
): Promise<string | undefined> {
  try {
    return (await jwt.verify(token))?.sub;
  } catch (err) {
    console.log(err);
  }
}

export async function generateTokenByUserId(
  userId: string
): Promise<string | undefined> {
  try {
    return await jwt.sign({ sub: userId });
  } catch (err) {
    console.log(err);
  }
}
