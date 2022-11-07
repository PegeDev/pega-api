const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const cors = require("cors");
const CronJob = require("./controllers/cron.js");
const tiktokRoute = require("./router/tiktok");
const authRoute = require("./router/auth");
const db = require("./config/Database.js");
const bodyParser = require("body-parser");
const Users = require("./models/UserModels.js");


function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const port  = getRandomInt(5000, 8000)

dotenv.config();

(async () => {
	await db.sync()
})()
const app = express();
app.use(express.json());
app.use(
	cors({
		credentials: true,
	})
);

app.use(tiktokRoute);
app.use(authRoute);

app.listen(5000, () => {
	console.log(`Node Started with `+5000);
});

CronJob.initScheduleCronJobs();
