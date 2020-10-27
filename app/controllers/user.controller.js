const db = require("../configs/db.configs");
const env = require("../configs/env");
var stream = require("stream");
const FileCV = db.FileCV;
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
const downloadFile = (req, res) => {
  FileCV.findOne({ where: { id: req.body.id } })
    .then((file) => {
      var fileContents = Buffer.from(file.data, "base64");
      var readStream = new stream.PassThrough();
      readStream.end(fileContents);

      res.set("Content-disposition", "attachment; filename=" + file.name);
      res.set("Content-Type", file.type);

      readStream.pipe(res);
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "Error", detail: err });
    });
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

const uploadFile = (req, res) => {
  FileCV.create({
    id: req.user.id,
    type: req.file.mimetype,
    name: req.file.originalname,
    data: req.file.buffer,
  })
    .then((file) => {
      console.log(file);

      const result = {
        filename: req.file.originalname,
        message: "Upload Successfully!",
      };

      res.status(StatusCodes.OK).json(result);
    })
    .catch((err) => {
      console.log(err);

      res.status(StatusCodes.NOT_FOUND).json(err);
    });
};

module.exports = {
  downloadFile,
  profile,
  uploadFile,
};
