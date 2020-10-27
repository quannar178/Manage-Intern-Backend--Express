const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const FileCV = sequelize.define(
    "FileCV",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      data: {
        type: DataTypes.BLOB("long"),
      },
    },
    {
      modelName: "FileCV",
    }
  );
  return FileCV;
};
