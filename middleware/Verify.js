const session = require("express-session");
const Users = require("../models/UserModels");

const verifyToken = async (req, res, next) => {
	if (!req.headers.apikey)
		return res.status(403).json({ status: false, msg: "Forbidden, your token is failure" });
	const validate = await Users.findOne({
		where: {
			apiKey: req.headers.apikey,
		},
	});
	if (!validate)
		return res.status(400).json({
			status: false,
			msg: "invalid apiKey, please contact dev, for more information!",
		});
	next();
};

module.exports = { verifyToken };
