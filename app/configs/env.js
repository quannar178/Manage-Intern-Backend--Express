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
  PRIVATE_KEY: "private_key",
  ROLE_ADMIN: 'admin',
  ROLE_LEADER: 'leader',
  ROLE_INTERN: 'intern'
};

module.exports = env;
