const db = require("../configs/db.configs");
const env = require("../configs/env");
const { StatusCodes } = require("http-status-codes");
const JWT = require("jsonwebtoken");
const { password } = require("../configs/env");
const nodemailer = require("nodemailer");
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
const changeRole = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.body.id } });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "not found user",
      });
    }
    console.log(user);
    user.role = req.body.role;

    const newuser = await user.save();
    console.log(newuser);
    res.status(StatusCodes.OK).json({
      message: "change role success",
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
  }
};

const login = async (req, res) => {
  const token = "Bearer " + encodeToken(req.user.id, req.user.role, 3);

  res.setHeader("Authorization", token);
  res.status(StatusCodes.OK).json({
    message: "Login sucessfully",
    role: req.user.role,
    id: req.user.id,
  });
};

const forgetPassword = async (req, res) => {
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
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Email or CMND is invalid",
    });
  }
};

const forgetPasswordPro = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email: email } });
  console.log(user);
  if (user) {
    const exp = 1;
    const token = encodeToken(user.id, user.role, exp);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PWD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset password using Node.js",
      text: "http://localhost:8080/resetpassword/" + token,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(404).json(error);
      } else {
        res.status(200).json({
          message: "Success send link",
        });
        console.log("Email sent: " + info.response);
      }
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Email is invalid",
    });
  }
};

const register = async (req, res) => {
  console.log("in auth controller", req.body);
  const { firstname, lastname, email, password } = req.body;

  try {
    const isValidUser = await User.findOne({ where: { email } });

    if (isValidUser) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "email is alived",
      });
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
  } catch (error) {
    res.status(StatusCodes.EXPECTATION_FAILED).json(erorr);
  }
};

const resetPassword = async (req, res) => {
  try {
    console.log("@@@@@", req.body);
    const password = req.body.password;
    if (password.toString().length < 6) {
      req.status(StatusCodes.BAD_REQUEST).json({
        message: "password is too short",
      });
    } else {
      const user = await User.findOne({ where: { id: req.user.id } });
      console.log(user);
      user.password = req.body.password;
      user.save();
      res.status(StatusCodes.OK).json({
        message: "change password success",
      });
    }
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
  }
};
const resetPasswordPro = async (req, res) => {
  try {
    console.log("@@@@@", req.body);
    const password = req.body.password;
    if (password.toString().length < 6) {
      console.log("");
      req.status(StatusCodes.BAD_REQUEST).json({
        message: "password is too short",
      });
    } else {
      console.log("@@@@rjewirlajlfklk");
      const token = req.params["token"];
      console.log("in middleware", token);
      var decoded = JWT.verify(token, env.PRIVATE_KEY);
      console.log(decoded);
      const user = await User.findOne({ where: { id: decoded["sub"] } });
      console.log(user);
      user.password = req.body.password;
      user.save();
      res.status(StatusCodes.OK).json({
        message: "change password success",
      });
    }
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
  }
};

module.exports = {
  changeRole,
  register,
  forgetPassword,
  forgetPasswordPro,
  login,
  resetPassword,
  resetPasswordPro,
};
