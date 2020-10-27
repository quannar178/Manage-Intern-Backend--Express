const { Sequelize } = require("sequelize");
const env = require("./env");
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

try {
  sequelize
    .authenticate()
    .then(() =>
      console.log("POSTGRE Connection has been established successfully.")
    );
} catch (error) {
  console.error("POSTGRE Unable to connect to the database:", error);
}

db.User = require("../models/user.model")(sequelize, Sequelize);
db.FileCV = require('../models/filecv.model')(sequelize, Sequelize)
db.Project = require('../models/project.model')(sequelize, Sequelize)

module.exports = db;
