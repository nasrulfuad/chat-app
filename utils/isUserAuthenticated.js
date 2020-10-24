const { AuthenticationError } = require("apollo-server");

module.exports = (user) => {
  /* Check if user authenticated */
  if (!user) throw new AuthenticationError("Unauthenticated");
};
