const express = require("express");
const env = require("../configs/env");
const { Project } = require("../configs/db.configs");
const ProjectControler = require("../controllers/project.controler");
const passport = require("passport");
const ConfigPassport = require("../middleware/passport");
const routerProject = express.Router();
const { validateBody, schemas } = require("../validations/project.validation");
const checkRole = require("../middleware/auth");

routerProject.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  ProjectControler.getProject
);

routerProject.post(
  "/create",
  (req, res, next) => {
    console.log("inrouter");
    next();
  },
  validateBody(schemas.project),
  passport.authenticate("jwt", { session: false }),
  checkRole(env.ROLE_ADMIN),
  ProjectControler.create
);

routerProject.get(
  "/getAll",
  passport.authenticate("jwt", { session: false }),
  checkRole(env.ROLE_ADMIN),
  ProjectControler.getAll
);

// routerProject.get("/:id", ProjectControler.getById)

routerProject.get(
  "/:id",
  (req, res, next) => {
    console.log(req.params);
    next();
  },
  ProjectControler.getById
);

routerProject.put(
  "/:id",
  (req, res, next) => {
    console.log(req.params);
    next();
  },
  passport.authenticate("jwt", { session: false }),
  checkRole(env.ROLE_ADMIN),
  ProjectControler.update
);

routerProject.delete(
  "/:id",
  (req, res, next) => {
    console.log(req.params);
    next();
  },
  passport.authenticate("jwt", { session: false }),
  checkRole(env.ROLE_ADMIN),
  ProjectControler.deleteProject
);

module.exports = routerProject;
