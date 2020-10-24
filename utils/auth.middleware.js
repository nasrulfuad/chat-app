const { PubSub } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

const pubsub = new PubSub();

module.exports = ({ req, connection, ...context }) => {
  let token;

  if (req && req.headers.authorization) {
    token = req.headers.authorization.split("Bearer ")[1];
  } else if (connection && connection.context.Authorization) {
    /* Middleware for websocket connection */
    token = connection.context.Authorization.split("Bearer ")[1];
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, (_, decoded) => {
      context.user = decoded;
    });
  }

  context.pubsub = pubsub;

  return context;
};
