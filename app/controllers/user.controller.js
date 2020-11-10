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
    console.log("###########", date);

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
    console.log("###########", date);
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
  console.log("jfksjflalksfjlkdjf@", idUser, month);
  try {
    const userSalary = await Salary.findOne({ where: { idUser, month } });
    // console.log(userSalary);

    if (userSalary) {
      console.log("exist");
      userSalary.salary = salary;
      userSalary.save();
      return;
    }
    const newSalary = await Salary.create({
      idUser,
      month,
      salary,
    });
    // console.log(newSalary);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
};

//main
const downloadFile = (req, res, next) => {
  console.log("@@@@@@@@@@@@@", req.body);
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

      // res.json({
      //   filename: file.name,
      // });

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
  console.log("####", req.body);
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

const getAll = async (req, res, next) => {
  const users = await User.findAll();
  let usersInfo = [];
  users.forEach((user) => {
    let info = {};
    info.id = user.id;
    info.firstname = user.firstname;
    info.lastname = user.lastname;
    info.role = user.role;
    info.leader = user.leader;
    info.project = user.project;
    usersInfo.push(info);
  });
  res.status(200).json(usersInfo);
};
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const filecv = await FileCV.findOne({ where: { idUser: req.user.id } });

    console.log("######", req.user.id);

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
      const date = new Date(schedule.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      // console.log("-----", schedule);
      updateOrInsertPublic(
        idUser,
        new Date(year, month, day, 0, 0, 0, 0),
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
      const date = new Date(schedule.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      updateOrInsertDraft(
        idUser,

        new Date(year, month, day, 0, 0, 0, 0),
        schedule.draft
      ).catch((error) => {
        throw new Error(error);
      });
    });
    res.status(StatusCodes.CREATED).json({
      message: "Save draft",
    });
    next();
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
  }
};

const schedule = async (req, res) => {
  const idUser = req.params["id"];
  console.log(idUser);
  const schedules = await Schedule.findAll({ where: { idUser } });
  const scheduleInfo = [];
  const monthNow = new Date(Date.now()).getMonth();
  schedules.forEach((schedule) => {
    const day = new Date(schedule["date"]);
    const month = day.getMonth();
    if (month === monthNow) {
      scheduleInfo[day.getDate() - 1] = schedule["draft"];
    }
  });
  res.status(200).json({ scheduleInfo });
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

      res.status(200).json(result);
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

      res.status(200).json(result);
    }
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res) => {
  console.log(req.body);
  const { id, role, leader, project } = req.body;
  const user = await User.findOne({ where: { id } });
  if (role) {
    user.role = role;
  }
  if (leader) {
    user.leader = leader;
  }
  if (project) {
    user.project = project;
  }

  user.save();

  res.status(200).json({
    message: "update success",
  });
};

const deleteUser = async (req, res) => {
  console.log(req.body);
  let user = await User.findOne({ where: { id: req.body.id } });
  console.log(user);
  await user.destroy();
  res.status(200).json({
    message: "Delete sucess",
  });
};

const getSalary = async (req, res) => {
  const users = await User.findAll();
  var resInfo = [];
  for (let i = 0; i < users.length; i++) {
    const id = users[i].id;
    console.log(id);

    const salaries = await Salary.findAll({ where: { idUser: id } });
    if (salaries.length == 0) {
      let info = {};
      info.id = users[i].id;
      info.firstname = users[i].firstname;
      info.lastname = users[i].lastname;
      info.month = "no info";
      info.salary = "no info";
      resInfo.push(info);
      console.log("length = 0");
    } else {
      for (let j = 0; j < salaries.length; j++) {
        let info = {};
        const element = salaries[j];
        console.log("element", element.idUser, element.month);
        info.id = users[i].id;
        info.firstname = users[i].firstname;
        info.lastname = users[i].lastname;
        info.month = element.month;
        info.salary = element.salary;
        resInfo.push(info);
        console.log(j);
      }
      console.log("lenth != 0");
    }
  }
  console.log(resInfo);
  res.status(200).json(resInfo);
};

module.exports = {
  downloadFile,
  updateProfile,
  getProfile,
  publicSchedule,
  registerSchedule,
  uploadFile,
  updateSalary,
  schedule,
  getAll,
  updateUser,
  deleteUser,
  getSalary,
};
