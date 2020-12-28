const UserController = require("../controllers/user.controller");
const env = require("../configs/env");
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
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  passport.authenticate("jwt", { session: false }),
  validateBody(schemas.profile),
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
  (req, res, next) => {
    console.log("@@@controller@@@@", req.file);
    next();
  },
  UserController.uploadFile
);

routerUser.post("/downloadcv", UserController.downloadFile);

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
routerUser.get("/schedule/:id", UserController.schedule);

routerUser
  .route("/salary")
  .post(
    (req, res, next) => {
      console.log("fsdjfkakj");
      next();
    },
    validateBodySalary(schemasSalary.schemaSalary),
    passport.authenticate("jwt", { session: false }),
    checkRole(env.ROLE_ADMIN),
    UserController.updateSalary
  )
  .get(
    passport.authenticate("jwt", { session: false }),
    checkRole(env.ROLE_ADMIN),
    UserController.getSalary
  );

routerUser
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    checkRole(env.ROLE_ADMIN),
    UserController.getAll
  )
  .put(
    passport.authenticate("jwt", { session: false }),
    checkRole(env.ROLE_ADMIN),
    UserController.updateUser
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    checkRole(env.ROLE_ADMIN),
    UserController.deleteUser
  );

routerUser.get(
  "/team",
  passport.authenticate("jwt", { session: false }),
  checkRole(env.ROLE_LEADER),
  UserController.getTeam
);
module.exports = routerUser;
