const bcryptjs = require("bcryptjs");
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
      firstname: {
        type: DataTypes.STRING,
        notEmpty: true,
      },
      lastname: {
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
      startedat: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
      role: {
        type: DataTypes.ENUM("intern", "leader", "admin"),
        defaultValue: "intern",
      },
      CMND: {
        type: DataTypes.STRING,
      },
      university: {
        type: DataTypes.STRING,
      },
      leader: {
        type: DataTypes.INTEGER,
      },
      project: {
        type: DataTypes.INTEGER,
      },
    },
    {
      modelName: "User",
    }
  );

  User.beforeCreate(async (user, options) => {
    try {
      const salt = await bcryptjs.genSalt();
      console.log(salt);
      const passwordHash = await bcryptjs.hash(user.password, salt);
      console.log(passwordHash);
      user.password = passwordHash;
    } catch (error) {}
  });

  User.beforeUpdate(async (user, options) => {
    try {
      const salt = await bcryptjs.genSalt();
      console.log(salt);
      const passwordHash = await bcryptjs.hash(user.password, salt);
      console.log(passwordHash);
      user.password = passwordHash;
    } catch (error) {}
  });

  User.prototype.isValidPassword = async function (newpasword) {
    try {
      console.log("in model", newpasword);
      return await bcryptjs.compare(newpasword, this.password);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  return User;
};
