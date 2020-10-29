const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Salary = sequelize.define(
    "Salary",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idUser: {
        type: DataTypes.INTEGER,
      },
      month: {
        type: DataTypes.INTEGER,
      },
      salary: {
        type: DataTypes.INTEGER,
      },
    },
    {
      modelName: "Salary",
    }
  );
  return Salary;
};
