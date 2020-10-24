const argon2 = require("argon2");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User, Message } = require("../../models");
const { JWT_SECRET } = require("../../config/env.json");
const isUserAuthenticated = require("../../utils/isUserAuthenticated");

module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        isUserAuthenticated(user);

        let users = await User.findAll({
          attributes: ["username", "image_url", "createdAt"],
          where: { Username: { [Op.ne]: user.username } },
        });

        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [["createdAt", "DESC"]],
        });

        users = users.map((otherUser) => {
          otherUser.latestMessage = allUserMessages.find(
            (message) =>
              message.from === otherUser.username ||
              message.to === otherUser.username
          );
          return otherUser;
        });

        return users;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (_, { username, password }) => {
      let errors = {};
      try {
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password === "") errors.password = "Password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad request", { errors });
        }

        const user = await User.findOne({
          where: { username },
        });

        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("user not found", { errors });
        }

        const isValidPassword = await argon2.verify(user.password, password);

        if (!isValidPassword) {
          errors.password = "Password is incorrect";
          throw new UserInputError("password is incorrect", { errors });
        }

        const token = jwt.sign(
          {
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
          },
          JWT_SECRET,
          { expiresIn: 60 * 60 }
        );

        return {
          ...user.toJSON(),
          token,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    register: async (_, { username, email, password, confirmPassword }) => {
      let errors = {};

      try {
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (email.trim() === "") errors.email = "Email must not be empty";
        if (password.trim() === "")
          errors.password = "Password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Confirm Password must not be empty";
        if (password !== confirmPassword)
          errors.confirmPassword = "Password must match";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        const hashedPassword = await argon2.hash(password);

        return await User.create({
          username,
          email,
          password: hashedPassword,
        });
      } catch (error) {
        console.log(error);
        if (error.name === "SequelizeUniqueConstraintError") {
          error.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (error.name === "SequelizeValidationError") {
          error.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad request", { errors });
      }
    },
  },
};
