const { Sequelize } = require("sequelize");

const db = new Sequelize("tiktok_database", "root", "ciamis1221@", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
