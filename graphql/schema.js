const { makeExecutableSchema } = require("@graphql-tools/schema");

const { userResolvers } = require("./resolvers");
const typeDefs = require("./type-defs");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...userResolvers,
  },
});

module.exports = schema;
