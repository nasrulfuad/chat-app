"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    static associate({ User, Message }) {
      /* Relations */
      this.belongsTo(User);
      this.belongsTo(Message);
    }
  }
  Reaction.init(
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Reaction",
      tableName: "reactions",
    }
  );
  return Reaction;
};
