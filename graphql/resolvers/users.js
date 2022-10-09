const fs = require("fs");
const { PubSub } = require("graphql-subscriptions");
const users = require("../../data/users");
const pubsub = new PubSub();

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

module.exports = resolvers;
