const express = require("express");
const { secondMethod, firstMethod } = require("../controllers/tiktok");
const { verifyToken } = require("../middleware/Verify");
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  await res.status(200).json({ status: true, msg: "this api for pegadev" });
});

router.get("/dl", firstMethod);
router.get("/dl/v2/", secondMethod);

module.exports = router;
