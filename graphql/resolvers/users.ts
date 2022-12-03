import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

interface Context {
  auth: string;
  prisma: PrismaClient;
}

const userResolvers = {
  Query: {
    users: () => [
      {
        name: "Talha Imran",
        age: 24,
      },
      {
        name: "Hamza Imran",
        age: 23,
      },
    ],
  },
  Mutation: {
    addUser: (_: any, args: { name: string; age: number }) => {
      const { name, age } = args;

      return { name, age };
    },
    createUsername: async (_: any, args: { username: string; }, context: Context) => {
      const { username } = args;

      const prisma = context.prisma;
      const updatedUser = await prisma.user.update({
        where: {
          id: context.auth,
        },
        data: {
          username,
        },
      })
      return updatedUser;
    },
  },
  Subscription: {
    userAdded: {
      subscribe: () => new PubSub().asyncIterator(["USER_ADDED"]),
    },
  },
};

export default userResolvers;
