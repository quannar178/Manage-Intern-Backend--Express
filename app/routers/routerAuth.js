const AuthController = require("../controllers/auth.controller");
const express = require("express");
const passport = require("passport");
const ConfigPassport = require("../middleware/passport");
const routerAuth = express.Router();
const { validateBody, schemas } = require("../validations/auth.validation");
const checkAdmin = require("../middleware/auth");

routerAuth.post(
  "/register",
  validateBody(schemas.resigter),
  AuthController.register
);

routerAuth.post(
  "/login",
  validateBody(schemas.login),
  passport.authenticate("local", { session: false }),
  AuthController.login
);

routerAuth.post("/forgetpassword", AuthController.forgetPassword);

routerAuth.post(
  "/resetpassword",
  passport.authenticate("jwt", { session: false }),
  AuthController.resetPassword
);

routerAuth.put(
  "/changerole",
  validateBody(schemas.changerole),
  passport.authenticate("jwt", { session: false }),
  checkAdmin,
  AuthController.changeRole
);

// validateBody(schemas.profile)
module.exports = routerAuth;
