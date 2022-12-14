const express = require("express");
const { Login, Register } = require("../controllers/Auth");
const router = express.Router();

router.post("/login", Login);
router.post("/register", Register);

module.exports = router;
