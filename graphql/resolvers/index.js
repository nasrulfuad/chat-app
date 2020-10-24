const user = require("./user");
const message = require("./message");
const { User, Message } = require("../../models");

module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Reaction: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    Message: async (parent) => await Message.findByPk(parent.messageId),
    User: async (parent) =>
      await User.findByPk(parent.userId, {
        attributes: ["username", "image_url", "createdAt"],
      }),
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
  Subscription: {
    ...message.Subscription,
  },
};
