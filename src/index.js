const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const users = require("../data/users");
const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    name: String
    age: Int
  }

  type Query {
    users: [User]
  }

  type Mutation {
    addUser(name: String, age: Int): User
  }
`;

const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    addUser: (_, { name, age }) => {
      const newUser = { name, age };
      users.push(newUser);

      fs.writeFile("./data/users.json", JSON.stringify(users), (err) => {
        if (err) console.log("Error writing file:", err);
      });

      return newUser;
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({ schema });
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
