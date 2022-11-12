const { Sequelize } = require("sequelize");

const db = new Sequelize("tiktok_database", "root", "Ciamis1221@", {
  host: "127.0.0.1",
  dialect: "mysql",
});

module.exports = db;
