import jwt from 'jsonwebtoken';
import config from '../config/config';

const algorithm = 'HS256';

export function sign(payload: string | object | Buffer, secret?: jwt.Secret) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      secret || config.SECRET_KEY,
      { algorithm },
      (err, token) => {
        if (err) {
          return reject(err);
        }

        resolve(token as string);
      }
    );
  });
}

export function verify(
  token: string,
  secret?: jwt.Secret
): Promise<jwt.JwtPayload | undefined> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      secret || config.SECRET_KEY,
      { algorithms: [algorithm] },
      async (err, payload) => {
        if (err) {
          return reject(err);
        }

        resolve(payload as jwt.JwtPayload | undefined);
      }
    );
  });
}
