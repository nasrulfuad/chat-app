const { ApolloServer } = require("apollo-server");
const { sequelize } = require("./models");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const contextMiddleware = require("./utils/auth.middleware");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

server.listen().then(({ url }) => {
  sequelize
    .authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

  console.log(`🚀🚀 Server running ot ${url} 🚀🚀`);
});
