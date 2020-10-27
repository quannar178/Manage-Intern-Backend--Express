const AuthController = require('../controllers/auth.controller')
const express = require('express')
const passport = require('passport');
const ConfigPassport = require('../middleware/passport')
const routerAuth = express.Router();
const { validateBody, schemas } = require('../validations/auth.validation')

routerAuth.post("/register", validateBody(schemas.resigter),AuthController.register);

routerAuth.post("/login", validateBody(schemas.login), passport.authenticate('local', {session: false}), AuthController.login)


module.exports = routerAuth;