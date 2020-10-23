const argon2 = require("argon2");
const { UserInputError } = require("apollo-server");
const { User } = require("../models");

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        console.log(error);
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
