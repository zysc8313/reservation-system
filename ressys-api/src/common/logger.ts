import { ApolloServerPlugin } from '@apollo/server';

export const loggerPlugin = (): ApolloServerPlugin => ({
  async requestDidStart() {
    return {
      async didEncounterErrors(requestContext) {
        if (requestContext.errors && requestContext.errors.length > 0) {
          const message = requestContext.errors
            .map((e) => e.message)
            .join('\n');
          requestContext.logger.error(`Error in graphql api: ${message}`);
        }
      },
    };
  },
  async unexpectedErrorProcessingRequest({ requestContext, error }) {
    requestContext.logger.error(error.message);
  },
});
