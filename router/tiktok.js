const express = require("express");
const { getVideoURL } = require("../controllers/tiktok");
const { verifyToken } = require("../middleware/Verify");
const router = express.Router();

router.get("/",verifyToken, async (req, res) => {
	await res.status(200).json({status: true, msg: 'this api for pegadev'})
	
});
router.get("/dl",verifyToken, getVideoURL);

module.exports = router;
