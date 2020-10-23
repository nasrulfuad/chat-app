const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

module.exports = (context) => {
  const { headers } = context.req;

  if (headers && headers.authorization) {
    const token = headers.authorization.split("Bearer ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) {
        context.user = decoded;
      }
    });
  }
  return context;
};
