const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./configs/db.configs");
const express = require("express");
const logger = require("morgan");
const routerAuth = require("./routers/routerAuth");
const routerProject = require("./routers/routerProject");
const routerUser = require("./routers/routerUser");
require("dotenv").config();
//create app
const port = 8000;
const app = express();

console.log(db.User);

//create table
// sync({ force: true }) - This creates the table, dropping it first if it already existed
db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and Resync with { force: true }");
});

//middleware
const corsOptions = {
  exposedHeaders: ["Authorization", "Content-Disposition"],
};
app.use(logger("dev"));
app.use(cors(corsOptions));
app.use(bodyParser.json());

//router
app.use("/api/project", routerProject);
app.use("/api/auth", routerAuth);
app.use("/api/user", routerUser);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`You are listening at ${port}`));
