const cronJob = require("node-cron");
const fs = require("fs");

exports.initScheduleCronJobs = () => {
  const cronJobsSchedule = cronJob.schedule("0 0 0 1/1 * ? *", () => {
    const cek = fs.readdirSync("./media");
    console.log(new Date().toLocaleString());
    if (cek.length > 0) {
      for (var file of cek) {
        fs.unlink(`./media/${file}`, (err) => {
          if (err) return err;
          if (!err) return console.log("suksess delete file ", file);
        });
      }
    } else {
      console.log("Dir is Empty!");
    }
  });
  console.log("Cron Jobs Started!");

  cronJobsSchedule.start();
};
