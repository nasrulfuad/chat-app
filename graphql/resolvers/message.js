const { UserInputError, withFilter } = require("apollo-server");
const { Op } = require("sequelize");
const { User, Message } = require("../../models");
const isUserAuthenticated = require("../../utils/isUserAuthenticated");

module.exports = {
  Query: {
    getMessages: async (_, { from }, { user }) => {
      try {
        isUserAuthenticated(user);

        const otherUser = await User.findOne({
          where: { username: from },
        });

        if (!otherUser) {
          throw new UserInputError("User not found");
        }

        const usernames = [user.username, otherUser.username];

        return await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [["createdAt", "DESC"]],
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { to, content }, { user, pubsub }) => {
      try {
        isUserAuthenticated(user);

        const recipient = await User.findOne({ where: { username: to } });

        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (to === user.username) {
          throw new UserInputError("You cannot message yourself");
        }

        if (content.trim() === "") {
          throw new UserInputError("Message cannot be empty");
        }

        const message = await Message.create({
          from: user.username,
          to,
          content,
        });

        pubsub.publish("NEW_MESSAGE", { newMessage: message });

        return message;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          isUserAuthenticated(user);
          return pubsub.asyncIterator(["NEW_MESSAGE"]);
        },
        ({ newMessage }, _, { user }) => {
          /* Check if the sender or receiver is the same with data authenticated */
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
