const express = require("express");
const { verifyToken } = require("../middleware/Verify");
const router = express.Router();

router.get("/download/:file", verifyToken, async (req, res) => {
  const filePath = "../media/" + req.params.file;
  await res.download(
    filePath,
    req.params.file, // Remember to include file extension
    (err) => {
      if (err) {
        res.send({
          error: err,
          msg: "Problem downloading the file",
        });
      }
    }
  );
});

module.exports = router;
