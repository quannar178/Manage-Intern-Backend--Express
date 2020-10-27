const env = {
    database: "interndb",
    username: "postgres",
    password: "123456",
    host: "localhost",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 80000,
      idle: 10000,
    },
  };
  
  module.exports = env;
  