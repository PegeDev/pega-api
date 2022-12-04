const express = require("express");
const fs = require("fs");
const path = require("path");
const Files = require("../models/files");
const router = express.Router();

router.get("/tiktok/download/", async (req, res) => {
  const { token, preview, music, keyword, trending } = req.query;
  try {
    console.log(token);
    const cek = await Files.findOne({
      where: {
        token: token,
      },
    });
    if (!cek)
      return res.status(500).json({ status: 0, msg: "File Not Found!" });
    const filename = cek.filename;

    let paths;
    let fileNameDown;
    if (trending || trending === 1) {
      paths = `./media/trending/${filename}`;
      fileNameDown = `PegaSnap-Trending-${cek.filename}`;
    } else if (keyword || keyword === 1) {
      paths = `./media/keywords/videos/${filename}`;
      fileNameDown = `PegaSnap-Keywords-${cek.filename}`;
    } else if (music || music === 1) {
      paths = `./media/trending/music/${filename}`;
      fileNameDown = `PegaSnap-Trending-${cek.filename}`;
    } else {
      paths = `./media/${filename}`;
      fileNameDown = filename;
    }
    console.log(paths);
    const filePath = path.resolve(paths);
    if (preview || preview === 1) {
      const videoPath = filePath;
      const videoStat = fs.statSync(videoPath);
      const fileSize = videoStat.size;
      const head = {
        "Content-Length": fileSize,
        "Content-Type": !music || music !== 1 ? "video/mp4" : "audio/mpeg",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    } else {
      res.download(filePath, fileNameDown, (err) => {
        if (err) {
          res.send({
            error: err,
            msg: "Problem downloading the file",
          });
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ status: 0, error: err });
  }
  //
});
router.get("/tiktok/images/cover/:filename", async (req, res) => {
  const { filename } = req.params;
  const { trending, keyword, avatar } = req.query;
  if (!filename)
    return res.status(404).json({ status: false, msg: "File Not Found" });
  let paths;
  if (trending || trending === 1) {
    paths = `./media/trending/images/${filename}`;
    if (avatar || avatar === 1) {
      paths = `./media/trending/images/avatar/${filename}`;
    }
  } else if (keyword || keyword === 1) {
    paths = `./media/keywords/cover/${filename}`;
    if (avatar || avatar === 1) {
      paths = `./media/keywords/avatar/${filename}`;
    }
  } else {
    paths = `./media/images/${filename}`;
  }
  const files = await path.resolve(paths);
  if (!fs.existsSync(files))
    return res.status(404).json({ status: false, msg: "File Not Found" });
  res.sendFile(files);
});

module.exports = router;
