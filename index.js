const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world'
  },
};

const server = new ApolloServer({
  typeDefs
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
