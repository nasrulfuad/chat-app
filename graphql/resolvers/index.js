const user = require("./user");
const message = require("./message");

module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    ...user.Query,
    ...message.Query,
  },
  Mutation: {
    ...user.Mutation,
    ...message.Mutation,
  },
};
