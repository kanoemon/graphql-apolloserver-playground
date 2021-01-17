const { ApolloServer, gql } = require('apollo-server');
//const typeDefs = require('./schema');

// The GraphQL schema
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Author {
    name: String
    books: [Book]
  }
  
  type Query {
    hello: String
    books: [Book]
  }
`;

const books = [
  {
    title: 'Cooking',
    author: 'Suzuki'
  },
  {
    title: 'Tech',
    author: 'Sato'
  }
];

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world',
    books: () => books
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
