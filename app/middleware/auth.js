const { StatusCodes } = require("http-status-codes");
const env = require("../configs/env");
const userModel = require("../models/user.model");

module.exports = checkRole = (role) => {
  return async (req, res, next) => {
    if (role === env.ROLE_ADMIN) {
      if (req.user.role === env.ROLE_ADMIN) {
        next();
      } else {
        res.status(StatusCodes.FORBIDDEN).json({
          message: "Need role admin",
        });
        next();
      }
    } else {
      if (
        req.user.role === env.ROLE_ADMIN ||
        req.user.role === env.ROLE_LEADER
      ) {
        next();
      } else {
        res.status(StatusCodes.FORBIDDEN).json({
          message: "Need role admin or leader",
        });
        next();
      }
    }
  };
};
