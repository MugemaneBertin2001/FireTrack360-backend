import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtService } from '../user/jwt.service';
import { Logger } from '@nestjs/common';

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: true,
  sortSchema: true,
  debug: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production',
  introspection: process.env.NODE_ENV !== 'production',
  subscriptions: {
    'graphql-ws': true,
  },
  context: ({ req }) => {
    const authJwtService = new AuthJwtService(
      new JwtService({ secret: process.env.JWT_SECRET }),
    );
    let user = null;
    const logger = new Logger('GraphQLContext');

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (token) {
      try {
        user = authJwtService.validateToken(token);
        logger.log('User authenticated:', user);
      } catch (err) {
        logger.error('Invalid or expired token:', err.message);
      }
    } else {
      logger.warn('No token provided in request headers.');
    }

    return {
      req,
      user: user || {},
    };
  },
};
