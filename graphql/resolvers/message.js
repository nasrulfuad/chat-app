const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");
const { User, Message } = require("../../models");

module.exports = {
  Query: {
    getMessages: async (_, { from }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

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
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { to, content }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        const recipient = await User.findOne({ where: { username: to } });

        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (to === user.username) {
          throw new UserInputError("You cannot message yourself");
        }

        if (content.trim() === "") {
          throw new UserInputError("Message cannot be empty");
        }

        return await Message.create({
          from: user.username,
          to,
          content,
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
