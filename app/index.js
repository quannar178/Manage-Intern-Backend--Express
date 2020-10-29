const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./configs/db.configs");
const express = require("express");
const logger = require("morgan");
const routerAuth = require("./routers/routerAuth");
const routerProject = require("./routers/routerProject");
const routerUser = require("./routers/routerUser");

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
  exposedHeaders: "Authorization",
};
app.use(logger("dev"));
app.use(cors(corsOptions));
app.use(bodyParser.json());

//router
app.use("/api/project", routerProject);
app.use("/api/auth", routerAuth);
app.use("/api/user", routerUser);

app.listen(port, () => console.log(`You are listening at ${port}`));
