const argon2 = require("argon2");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User } = require("../models");
const { JWT_SECRET } = require("../config/env.json");

module.exports = {
  Query: {
    getUsers: async (_, __, { req }) => {
      let user;

      try {
        if (req.headers && req.headers.authorization) {
          const token = req.headers.authorization.split("Bearer ")[1];
          jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
              throw new AuthenticationError("Unauthenticated");
            }
            user = decoded;
          });
        }

        return await User.findAll({
          where: { Username: { [Op.ne]: user.username } },
        });
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
            username,
          },
          JWT_SECRET,
          { expiresIn: 60 * 60 }
        );

        return {
          ...user.toJSON(),
          token,
          createdAt: user.createdAt.toISOString(),
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
