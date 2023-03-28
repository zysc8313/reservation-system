import dotenv from 'dotenv';
import { bool, cleanEnv, makeValidator, port, str } from 'envalid';

const bodyParserValidator = makeValidator((value): number => {
  if (typeof value !== 'number') throw new Error('Expected type number');
  if (value <= 0) throw new Error('Expected value to be greater than 0');
  return value;
});

dotenv.config();

export default cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'testing', 'production', 'staging'],
    default: 'development',
  }),
  GRAPHQL_INTROSPECTION_ENABLED: bool({ default: false, devDefault: true }),
  GRAPHQL_PLAYGROUND_ENABLED: bool({ default: false, devDefault: true }),
  MONGO_URL: str({
    devDefault: 'mongodb://localhost:27017/ressys',
  }),
  SECRET_KEY: str({
    devDefault: 'The Quick Brown Fox Jumps Over the Lazy Dog',
    desc: 'The secret key for jwt',
  }),
  PORT: port({
    default: 3000,
  }),
  LOG_LEVEL: str({
    choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
    default: 'warn',
    devDefault: 'debug',
  }),
  BODY_PARSER_SIZE_LIMIT: bodyParserValidator({
    default: 5 * 1000000, // value in bytes
  }),
});
