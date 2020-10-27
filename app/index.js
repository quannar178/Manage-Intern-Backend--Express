const bodyParser = require("body-parser");
const db = require("./configs/db.configs");
const express = require("express");
const logger = require("morgan");
const routerProject = require("./routers/routerProject");

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
app.use(logger("dev"));
app.use(bodyParser.json());

//router
app.use("/api/project", routerProject);

app.listen(port, () => console.log(`You are listening at ${port}`));
