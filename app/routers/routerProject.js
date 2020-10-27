const express = require("express");
const { Project } = require("../configs/db.configs");
const ProjectControler = require("../controllers/project.controler");
const routerProject = express.Router();
const { validateBody, schemas } = require("../validations/project.validation");

routerProject.post(
  "/create",
  (req, res, next) => {
    console.log("inrouter");
    next();
  },
  validateBody(schemas.project),
  ProjectControler.create
);

routerProject.get("/getAll", ProjectControler.getAll);

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
  ProjectControler.update
);

routerProject.delete(
  "/:id",
  (req, res, next) => {
    console.log(req.params);
    next();
  },
  ProjectControler.deleteProject
);

module.exports = routerProject;
