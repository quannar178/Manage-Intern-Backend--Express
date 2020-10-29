const db = require("../configs/db.configs");
const Project = db.Project;
const { StatusCodes } = require("http-status-codes");

const create = async (req, res, next) => {
  const { name, description, deadline } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      deadline,
    });
    res.status(StatusCodes.CREATED).json({
      message: "project is created",
    });
    return next();
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.id } });
    if (!project) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "project not found",
      });
    }

    await project.destroy();

    res.status(StatusCodes.OK).json({
      message: "Delete successfuly",
    });
    return next();
  } catch (error) {
    return next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    let projectsInfo = [];
    projects.forEach((project) => {
      projectsInfo.push({
        id: project.id,
        name: project.name,
        description: project.description,
        createAt: project.createdAt,
        deadline: project.deadline,
      });
    });
    res.status(StatusCodes.OK).json(projectsInfo);
    return next();
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.id } });
    if (!project) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "project not found",
      });
    }
    let projectInfo = [];
    projectInfo.push({
      id: project.id,
      name: project.name,
      description: project.description,
      createAt: project.createdAt,
      deadline: project.deadline,
    });
    res.status(StatusCodes.OK).json(projectInfo);
    return next();
  } catch (error) {
    return next(error);
  }
};

const getProject = async (req, res, next) => {
  const projectId = req.user.project;
  if (!projectId) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "You didn't join project",
    });
  }

  const project = await Project.findOne({ where: { id: projectId } });

  if (!project) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Didn't find project",
    });
  }

  let projectInfo = [];
  projectInfo.push({
    id: project.id,
    name: project.name,
    description: project.description,
    createAt: project.createdAt,
    deadline: project.deadline,
  });

  res.status(StatusCodes.OK).json(projectInfo);
};

const update = async (req, res, next) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.id } });
    if (!project) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "project not found",
      });
    }

    console.log("before update:", project);

    const { name, description, deadline } = req.body;

    project.name = name;
    project.description = description;
    project.deadline = deadline;

    const updatedProject = await project.save();

    console.log("updated:", updatedProject);

    res.status(StatusCodes.OK).json({
      message: "Update successfuly",
    });
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
  deleteProject,
  getAll,
  getById,
  getProject,
  update,
};
