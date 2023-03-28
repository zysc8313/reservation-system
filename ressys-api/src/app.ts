import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import mongoose from 'mongoose';
import pino, { Logger } from 'pino';
import { buildSchema } from 'type-graphql';
import { AuthChecker } from './common/authChecker';
import { contextBuilder } from './common/contextBuilder';
import { loggerPlugin } from './common/logger';
import config from './config/config';
import initDemoData from './initDemoData';
import { AuthResolver } from './resolvers/auth.resolver';
import { OrderResolver } from './resolvers/order.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { Context } from './types';

export default class App {
  private app: Application;
  private logger: Logger;
  private httpServer: http.Server;

  constructor() {
    this.app = express();
    this.logger = pino({ level: config.LOG_LEVEL });
    this.httpServer = http.createServer(this.app);

    this.connectToDatabase();
    this.initMiddlewares();
    this.initApolloServer();
    initDemoData();
  }

  listen() {
    this.httpServer.listen({ port: config.PORT }, () => {
      console.log(
        `🚀 Ressys API server ready at http://localhost:${config.PORT}`
      );
    });
  }

  private async connectToDatabase() {
    try {
      await mongoose.connect(config.MONGO_URL);
    } catch (error) {
      this.logger.error(error);
      process.exit(1);
    }
  }

  private initMiddlewares() {
    if (config.isProd) {
      this.app.use(hpp());
      this.app.use(helmet());
    }

    this.app.use(
      cors(),
      compression(),
      express.json({ limit: config.BODY_PARSER_SIZE_LIMIT }),
      express.urlencoded({ extended: true }),
      cookieParser()
    );
  }

  private async initApolloServer() {
    const schema = await buildSchema({
      resolvers: [AuthResolver, OrderResolver, UserResolver],
      authChecker: AuthChecker,
    });

    const apolloServer = new ApolloServer<Context>({
      logger: this.logger,
      schema,
      introspection: config.GRAPHQL_INTROSPECTION_ENABLED,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
        config.GRAPHQL_PLAYGROUND_ENABLED
          ? ApolloServerPluginLandingPageLocalDefault({
              footer: false,
            })
          : ApolloServerPluginLandingPageProductionDefault({ footer: false }),
        loggerPlugin(),
      ],
    });

    await apolloServer.start();

    this.app.use(
      expressMiddleware(apolloServer, {
        context: contextBuilder,
      })
    );
  }
}
