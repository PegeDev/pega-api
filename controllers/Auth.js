const Users = require("../models/users");
const argon2 = require("argon2");

const Login = async (req, res) => {
  try {
    const { username, password } = await req.body;
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (!username || !password)
      return res.status(400).json({ status: false, msg: "Akses ditolak" });
    var data = {};
    if (validateEmail(username)) {
      data = {
        email: username,
      };
    } else {
      data = {
        username: username,
      };
    }
    const user = await Users.findOne({
      where: data,
    });
    if (!user)
      return res
        .status(404)
        .json({ status: false, msg: "User tidak ditemukan" });
    const match = await argon2.verify(user.password, password);
    if (!match)
      return res.status(401).json({ status: false, msg: "Password salah" });
    const randStr = (length) => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = " ";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    };

    if (!user.apiKey) {
      var update = await Users.update(
        {
          apiKey: randStr(64).replace(" ", ""),
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      return res
        .status(200)
        .json({ status: true, msg: "Berhasil login", apiKey: update.apiKey });
    }
    return res
      .status(200)
      .json({ status: true, msg: "Berhasil login", apiKey: user.apiKey });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: false, msg: "Server Error", err: err.response });
  }
};
const Register = async (req, res) => {
  const { fullname, username, password, email } = req.body;
  if (!fullname || !username || !password || !email)
    return res.status(400).json({ status: false, msg: "Akses ditolak" });
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });
  if (user)
    return res.status(403).json({
      status: false,
      msg: "User dengan Username tersebut telah digunakan",
    });
  const mail = await Users.findOne({
    where: {
      username: username,
    },
  });
  if (mail)
    return res.status(403).json({
      status: false,
      msg: "User dengan Email tersebut telah digunakan",
    });
  try {
    const decPass = await argon2.hash(password);
    await Users.create({
      fullname: fullname,
      username: username.toLowerCase(),
      email: email,
      password: decPass,
    });
    return res.status(201).json({ status: true, msg: "Akun berhasil dibuat" });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, msg: "Server Error", err: err.name });
  }
};

module.exports = {
  Login,
  Register,
};
