const db = require("../configs/db.configs");
const env = require("../configs/env");
const { StatusCodes } = require("http-status-codes");
const JWT = require("jsonwebtoken");
const User = db.User;

const encodeToken = (uuiduser) => {
  return JWT.sign(
    {
      iss: "Ba Quan",
      sub: uuiduser,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    env.PRIVATE_KEY
  );
};

const login = async (req, res, next) => {
  const token = "Bearer " + encodeToken(req.user);

  res.setHeader("Authorization", token);
  res.status(StatusCodes.OK).json({
    message: "Login sucessfully",
  });
  next();
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

module.exports = {
  register,
  login,
};
