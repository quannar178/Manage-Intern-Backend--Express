const multer = require("multer");

var storage = multer.memoryStorage();
var upload = multer({ dest: "uploads/" });

module.exports = upload;
