const db = require("../configs/db.configs");
const env = require("../configs/env");
var stream = require("stream");
const FileCV = db.FileCV;
const { StatusCodes } = require("http-status-codes");
const JWT = require("jsonwebtoken");
const User = db.User;
const Schedule = db.Schedule;
const Salary = db.Salary;

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

const updateOrInsertSalary = async (idUser, month, salary) => {
  console.log("jfksjflalksfjlkdjf@");
  try {
    const userSalary = await Salary.findOne({ where: { idUser, month } });

    if (userSalary) {
      console.log("exist", userSalary);
      userSalary.salary = salary;
      userSalary.save();
      return;
    }
    const newSalary = await Salary.create({
      idUser,
      month,
      salary,
    });
    console.log(newSalary);
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};

//main
const downloadFile = (req, res, next) => {
  FileCV.findOne({ where: { idUser: req.body.id } })
    .then((file) => {
      if (!file) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "No CV",
        });
        next();
      }
      var fileContents = Buffer.from(file.data, "base64");
      var readStream = new stream.PassThrough();
      readStream.end(fileContents);

      res.set("Content-disposition", "attachment; filename=" + file.name);
      res.set("Content-Type", file.type);

      readStream.pipe(res);
      next();
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "Error", detail: err });
      next();
    });
};
const updateProfile = async (req, res, next) => {
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
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const filecv = await FileCV.findOne({ where: { id: req.user.id } });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "not found user",
      });
      next();
    }
    let userInfo = {};

    if (!filecv) {
      userInfo["hasCV"] = false;
    } else {
      userInfo["hasCV"] = true;
    }

    // console.log(user);
    if (user.firstname) {
      userInfo["firstname"] = user.firstname;
    } else {
      userInfo["firstname"] = "No infomation";
    }

    if (user.lastname) {
      userInfo["lastname"] = user.lastname;
    } else {
      userInfo["lastname"] = "No infomation";
    }
    if (user.email) {
      userInfo["email"] = user.email;
    } else {
      userInfo["email"] = "No infomation";
    }
    if (user.gender) {
      userInfo["gender"] = user.gender;
    } else {
      userInfo["gender"] = "No infomation";
    }
    if (user.nation) {
      userInfo["nation"] = user.nation;
    } else {
      userInfo["nation"] = "No infomation";
    }
    if (user.startedat) {
      userInfo["startedat"] = user.startedat;
    } else {
      userInfo["startedat"] = "No infomation";
    }
    if (user.role) {
      userInfo["role"] = user.role;
    } else {
      userInfo["role"] = "No infomation";
    }
    if (user.CMND) {
      userInfo["CMND"] = user.CMND;
    } else {
      userInfo["CMND"] = "No infomation";
    }
    if (user.university) {
      userInfo["university"] = user.university;
    } else {
      userInfo["university"] = "No infomation";
    }
    if (user.leader) {
      userInfo["leader"] = user.leader;
    } else {
      userInfo["leader"] = "No infomation";
    }
    if (user.project) {
      userInfo["project"] = user.project;
    } else {
      userInfo["project"] = "No infomation";
    }
    // console.log("Update.............", newuser);
    res.status(StatusCodes.OK).json(userInfo);
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

const uploadFile = async (req, res, next) => {
  try {
    //find
    const filecv = await FileCV.findOne({ where: { idUser: req.user.id } });
    console.log("in user controller@@@", filecv);
    if (filecv) {
      filecv.idUser = req.user.id;
      filecv.type = req.file.mimetype;
      filecv.name = req.file.originalname;
      filecv.data = req.file.data;
      await filecv.save();

      const result = {
        filename: req.file.originalname,
        message: "Upload Successfully!",
      };

      res.status(StatusCodes.OK).json(result);
      next();
    } else {
      await FileCV.create({
        idUser: req.user.id,
        // idUser: 102,
        type: req.file.mimetype,
        name: req.file.originalname,
        data: req.file.buffer,
      });
      const result = {
        filename: req.file.originalname,
        message: "Upload Successfully!",
      };

      res.status(StatusCodes.OK).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const updateSalary = async (req, res, next) => {
  const { idUser, month, salary } = req.body;
  console.log(req.body);
  try {
    await updateOrInsertSalary(idUser, month, salary);
    res.status(StatusCodes.OK).json({
      message: "change salary successfully",
    });
    next();
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
    next();
  }
};

module.exports = {
  downloadFile,
  updateProfile,
  getProfile,
  publicSchedule,
  registerSchedule,
  uploadFile,
  updateSalary,
};
