const express = require("express");
const users = require("../data/users");

const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    name: String
    age: Int
  }

  type Query {
    users: [User]
  }
`;

const resolvers = {
  Query: {
    users: () => users,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

const PORT = 5000;

server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
});
