const AuthController = require("../controllers/auth.controller");
const express = require("express");
const passport = require("passport");
const ConfigPassport = require("../middleware/passport");
const routerAuth = express.Router();
const { validateBody, schemas } = require("../validations/auth.validation");
const checkRole = require("../middleware/auth");
const env = require("../configs/env");
const jwt = require("jsonwebtoken");

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
routerAuth.post("/forgetpasswordpro", AuthController.forgetPasswordPro);

routerAuth.post(
  "/resetpassword",
  passport.authenticate("jwt", { session: false }),
  AuthController.resetPassword
);

routerAuth.get(
  "/resetpasswordpro/:token",
  AuthController.resetPasswordPro
);

routerAuth.put(
  "/changerole",
  validateBody(schemas.changerole),
  passport.authenticate("jwt", { session: false }),
  checkRole(env.ROLE_ADMIN),
  AuthController.changeRole
);

routerAuth.post(
  "/getinfo",
  passport.authenticate("jwt", { session: false }),
  AuthController.login
);

// validateBody(schemas.profile)
module.exports = routerAuth;
