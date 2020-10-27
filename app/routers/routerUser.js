const UserController = require("../controllers/user.controller");
const express = require("express");
const passport = require("passport");
const ConfigPassport = require("../middleware/passport");
const routerUser = express.Router();
const { validateBody, schemas } = require("../validations/auth.validation");

routerUser.put(
    "/profile",
    validateBody(schemas.profile),
    passport.authenticate("jwt", { session: false }),
    UserController.profile
  );

module.exports = routerUser