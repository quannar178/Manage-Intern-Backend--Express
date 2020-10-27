const db = require("../configs/db.configs");
const env = require("../configs/env");
const { StatusCodes } = require("http-status-codes");
const JWT = require("jsonwebtoken");
const User = db.User;

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

const profile = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "not found user",
      });
    }
    // console.log(user);
    const { firstname, lastname, gender, nation, CMND, university } = req.body;

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (gender) user.gender = gender;
    if (nation) user.nation = nation;
    if (CMND) user.CMND = CMND;
    if (university) user.university = university;

    const newuser = await user.save();
    // console.log("Update.............", newuser);
    res.status(StatusCodes.OK).json({
      message: "Update profile successfully",
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
    next();
  }
};

module.exports = {
  profile,
};
