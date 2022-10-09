const { gql } = require("apollo-server-express");

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

  type Subscription {
    userAdded: User
  }
`;

module.exports = typeDefs;
