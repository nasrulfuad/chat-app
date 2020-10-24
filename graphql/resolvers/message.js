const { ForbiddenError, UserInputError, withFilter } = require("apollo-server");
const { Op } = require("sequelize");
const { User, Message, Reaction } = require("../../models");
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

    reactToMessage: async (_, { uuid, content }, { user, pubsub }) => {
      const reactions = ["❤️", "😂", "😯", "😢", "😠", "👍", "👎"];

      try {
        isUserAuthenticated(user);

        if (!reactions.includes(content))
          throw new UserInputError("Invalid reaction");

        user = await User.findOne({ where: { username: user.username } });

        if (!user) {
          isUserAuthenticated(user);
        }

        const message = await Message.findOne({ where: { uuid } });
        if (!message) throw new UserInputError("Message not found");

        if (message.from !== user.username && message.to !== user.username)
          throw new ForbiddenError("Unauthorized");

        let reaction = await Reaction.findOne({
          where: {
            messageId: message.id,
            userId: user.id,
          },
        });

        /* Check if reaction exist then update */
        if (reaction) {
          reaction.content = content;
          await reaction.save();
        } else {
          reaction = await Reaction.create({
            messageId: message.id,
            userId: user.id,
            content,
          });
        }
        pubsub.publish("NEW_REACTION", { newReaction: reaction });
        return reaction;
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
          return pubsub.asyncIterator("NEW_MESSAGE");
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
    newReaction: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          isUserAuthenticated(user);
          return pubsub.asyncIterator("NEW_REACTION");
        },
        async ({ newReaction }, _, { user }) => {
          const message = await newReaction.getMessage();
          if (message.from === user.username || message.to === user.username) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
