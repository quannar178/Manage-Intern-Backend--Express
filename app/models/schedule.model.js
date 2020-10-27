const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Schedule = sequelize.define(
    "Schedule",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idUser: {
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.DATE,
      },
      draft: {
        type: DataTypes.ENUM("M", "A", "F", "O"),
        defaultValue: "O",
      },
      publicSche: {
        type: DataTypes.ENUM("M", "A", "F", "O"),
        defaultValue: "O",
      },
    },
    {
      modelName: "Schedule",
    }
  );
  return Schedule;
};
