const db = require("../configs/db.configs");
const env = require("../configs/env");
const { StatusCodes } = require("http-status-codes");
const JWT = require("jsonwebtoken");
const User = db.User;

//helper
const encodeToken = (sub, role, exp) => {
  return JWT.sign(
    {
      iss: "Ba Quan",
      sub: sub,
      role: role,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + exp),
    },
    env.PRIVATE_KEY
  );
};

//main
const changeRole = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.body.id } });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "not found user",
      });
      next();
    }
    console.log(user);
    user.role = req.body.role;

    const newuser = await user.save();
    console.log(newuser);
    res.status(StatusCodes.OK).json({
      message: "change role success",
    });
    next();
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
    next();
  }
};

const login = async (req, res, next) => {
  const token = "Bearer " + encodeToken(req.user.id, req.user.role, 3);

  res.setHeader("Authorization", token);
  res.status(StatusCodes.OK).json({
    message: "Login sucessfully",
    role: req.user.role,
  });
  next();
};

const forgetPassword = async (req, res, next) => {
  const { email, CMND } = req.body;
  const user = await User.findOne({ where: { email: email } });
  console.log(user);
  if (user && user.CMND === CMND) {
    const exp = 1;
    const token = "Bearer " + encodeToken(user.id, user.role, exp);
    res.setHeader("Authorization", token);
    res.status(StatusCodes.OK).json({
      message: "Cho phep doi mat khau trong 1 ngay",
    });
    next();
  }

  res.status(StatusCodes.BAD_REQUEST).json({
    message: "Email or CMND is invalid",
  });
};

const register = async (req, res, next) => {
  console.log("in auth controller", req.body);
  const { firstname, lastname, email, password } = req.body;

  try {
    const isValidUser = await User.findOne({ where: { email } });

    if (isValidUser) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "email is alived",
      });
      return next();
    }

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
    });
    res.status(StatusCodes.CREATED).json({
      message: "New user is created",
    });
    return next();
  } catch (error) {
    res.status(StatusCodes.EXPECTATION_FAILED).json(erorr);
    return next();
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    user.password = req.body.password;
    user.save();
    res.status(StatusCodes.OK).json({
      message: "change password success",
    });
    next();
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
  }
};

module.exports = {
  changeRole,
  register,
  forgetPassword,
  login,
  resetPassword,
};
