const UserController = require("../controllers/user.controller");
const express = require("express");
const upload = require("../configs/multer.config");
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

routerUser.post(
  "/uploadcv",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  UserController.uploadFile
);

routerUser.get("/downloadcv", UserController.downloadFile);

module.exports = routerUser;
