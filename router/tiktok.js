const express = require("express");
const {
  secondMethod,
  firstMethod,
  getTrending,
} = require("../controllers/tiktok");
const { verifyToken } = require("../middleware/Verify");
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  await res.status(200).json({ status: true, msg: "this api for pegadev" });
});

router.get("/tiktok", firstMethod);
router.get("/tiktok/v2/", secondMethod);
router.get("/tiktok/trending/", getTrending);

module.exports = router;
