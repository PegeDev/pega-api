const { Sequelize } = require("sequelize");

const fs = require("fs");
const path = require("path");
const db = new Sequelize("tiktok_database", "root", "ciamis1221@", {
  host: "127.0.0.1",
  dialect: "mysql",
});

module.exports = db;
