const db = require("../configs/db.configs");
const env = require("../configs/env");
var stream = require("stream");
const FileCV = db.FileCV;
const { StatusCodes } = require("http-status-codes");
const JWT = require("jsonwebtoken");
const User = db.User;
const Schedule = db.Schedule;

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
const updateOrInsertDraft = async (idUser, date, draft) => {
  try {
    const schedule = await Schedule.findOne({ where: { idUser, date } });
    console.log("Schedule -----------------", schedule);
    if (schedule) {
      schedule.draft = draft;
      await schedule.save();
    } else {
      await Schedule.create({
        idUser: idUser,
        date: date,
        draft: draft,
      });
    }
  } catch (error) {
    return new Error(error);
  }
};

const updateOrInsertPublic = async (idUser, date, pub) => {
  try {
    const schedule = await Schedule.findOne({ where: { idUser, date } });
    console.log(schedule);
    if (schedule) {
      schedule.draft = pub;
      schedule.publicSche = pub;
      schedule.save();
    } else {
      await Schedule.create({
        idUser,
        date,
        draft: pub,
        publicSche: pub,
      });
    }
  } catch (error) {
    return new Error(error);
  }
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

const publicSchedule = async (req, res, next) => {
  try {
    const schedules = req.body.schedule;
    const idUser = req.user.id;
    schedules.forEach(async (schedule) => {
      console.log("-----", schedule);
      updateOrInsertPublic(
        idUser,
        new Date(schedule.date),
        schedule.publicSche
      ).catch((error) => {
        throw new Error(error);
      });
    });
    res.status(StatusCodes.CREATED).json({
      message: "Save schedule",
    });
    next();
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
  }
};

const registerSchedule = async (req, res, next) => {
  try {
    const schedules = req.body.schedule;
    const idUser = req.user.id;
    console.log(schedules);

    schedules.forEach(async (schedule) => {
      updateOrInsertDraft(
        idUser,
        new Date(schedule.date),
        schedule.draft
      ).catch((error) => {
        throw new Error(error);
      });
      // await Schedule.create({
      //   idUser: idUser,
      //   date: schedule.date,
      //   draft: schedule.draft,
      // });
    });
    res.status(StatusCodes.CREATED).json({
      message: "Save draft",
    });
    next();
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
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
  publicSchedule,
  registerSchedule,
  uploadFile,
};
