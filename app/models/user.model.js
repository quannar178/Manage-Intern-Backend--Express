const { DataTypes } = require("sequelize");
module.exports = function (sequelize, Sequelize) {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      uuiduser: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        notEmpty: true,
      },
      lastName: {
        type: DataTypes.STRING,
        notEmpty: true,
      },
      email: {
        type: DataTypes.STRING,
        notEmpty: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        notEmpty: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        defaultValue: "male",
      },
      nation: {
        type: DataTypes.STRING,
      },
      startedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
      role: {
        type: DataTypes.ENUM("user", "intern", "leader", "admin"),
        defaultValue: "user",
      },
      CMND: {
        type: DataTypes.STRING
      },
      university: {
        type: DataTypes.STRING
      },
      leader: {
        type: DataTypes.INTEGER
      },
      project: {
        type: DataTypes.INTEGER
      }
    },
    {
      modelName: "User",
    }
  );

  return User;
};
