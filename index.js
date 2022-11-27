const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const cors = require("cors");
const CronJob = require("./controllers/cron.js");
const tiktokRoute = require("./router/tiktok");
const downloadsRoute = require("./router/download");
const authRoute = require("./router/auth");
const db = require("./config/Database");
const bodyParser = require("body-parser");
const Files = require("./models/files.js");
const Users = require("./models/users.js");
const path = require("path");

dotenv.config();
db.sync();
// Files.drop();
const app = express();
app.use(express.static(__dirname + "./media/images"));
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);

app.use(tiktokRoute);
app.use(authRoute);
app.use(downloadsRoute);

app.listen(5000, () => {
  console.log(`Node Started with ` + 5000);
});

CronJob.initScheduleCronJobs();
