const UserController = require("../controllers/user.controller");
const env = require('../configs/env')
const express = require("express");
const upload = require("../configs/multer.config");
const passport = require("passport");
const ConfigPassport = require("../middleware/passport");
const routerUser = express.Router();
const checkRole = require("../middleware/auth");

const { validateBody, schemas } = require("../validations/auth.validation");
const {
  validateBodySchedule,
  schemasSchedule,
} = require("../validations/user.validation");
const {
  validateBodySalary,
  schemasSalary,
} = require("../validations/salary.validation");

routerUser.put(
  "/updateprofile",
  validateBody(schemas.profile),
  passport.authenticate("jwt", { session: false }),
  UserController.updateProfile
);

routerUser.get(
  "/getprofile",
  passport.authenticate("jwt", { session: false }),
  UserController.getProfile
);

routerUser.post(
  "/uploadcv",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  UserController.uploadFile
);

routerUser.get("/downloadcv", UserController.downloadFile);

routerUser.post(
  "/registerschedule",
  validateBodySchedule(schemasSchedule.schemaPerDayDraft),
  passport.authenticate("jwt", { session: false }),
  UserController.registerSchedule
);

routerUser.post(
  "/publicschedule",
  validateBodySchedule(schemasSchedule.schemaPerDayPublic),
  passport.authenticate("jwt", { session: false }),
  UserController.publicSchedule
);

routerUser.post(
  "/changesalary",
  validateBodySalary(schemasSalary.schemaSalary),
  passport.authenticate("jwt", { session: false }),
  checkRole(env.ROLE_ADMIN),
  UserController.updateSalary
);
module.exports = routerUser;
