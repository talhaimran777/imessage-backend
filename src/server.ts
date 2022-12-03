import express from "express";
import cors from "cors";

import { ApolloServer, gql } from "apollo-server-express";
import { createServer } from "http";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import resolvers from "../graphql/resolvers";
import typeDefs from "../graphql/type-defs";
import { PubSub } from "graphql-subscriptions";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const schema = makeExecutableSchema({ typeDefs, resolvers });

export const app = express();
app.use(cors());

export const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

const pubsub = new PubSub();

export const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
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
  context: async ({ req, res }) => {
    return { auth: req.headers.authorization, prisma: prisma }
  },
});
