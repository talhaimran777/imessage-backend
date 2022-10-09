const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const users = require("../data/users");
const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server-express");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

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

const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    addUser: (_, { name, age }) => {
      users.push({ name, age });

      fs.writeFile("./data/users.json", JSON.stringify(users), (err) => {
        if (err) console.log("Error writing file:", err);
      });

      pubsub.publish("USER_ADDED", {
        userAdded: {
          name,
          age,
        },
      });

      return { name, age };
    },
  },
  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(["USER_ADDED"]),
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Subscription Setup
const { createServer } = require("http");
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const app = express();
app.use(cors());

const httpServer = createServer(app);

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if your ApolloServer serves at
  // a different path.
  path: "/graphql",
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);
// Subscription Setup

const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

const PORT = 5000;

server.start().then(() => {
  server.applyMiddleware({ app });
  httpServer.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
});
