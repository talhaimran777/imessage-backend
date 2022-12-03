import { gql } from "apollo-server-core";

const typeDefs = gql`
  type User {
    name: String
    age: Int
    username: String
  }

  type Query {
    users: [User]
  }

  type Mutation {
    addUser(name: String, age: Int): User
    createUsername(username: String): User
  }

  type Subscription {
    userAdded: User
  }
`;

export default typeDefs;
