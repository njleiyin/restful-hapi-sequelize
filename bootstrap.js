/**
 * Created by leiyin on 2020/03/10.
 */
"use strict";
const settings = require('./settings.js');
//初始化数据库连接
const db = require('./libs/database.js')(settings.mysql);
console.log('db',db)
module.exports = function () {
    const models = require("./models")(db);
    return { db: db, models: models };
};