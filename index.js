/**
 * Created by leiyin on 20/03/09.
 */
"use strict";

const redis = require('./libs/common_redis.js');
const settings = require('./settings.js');

const PORT = 3002;
//连接数据库，实例化对象
const db = require('./libs/database.js')(settings.mysql);
//加载models下文件
const models = require("./models")(db);

const init = async () => {
    //实例化hai服务
    const hapiServer = await require('./server.js')(PORT, db);
    require("./routes")(hapiServer, models, hapiServer.oauth);
    //同步数据库model
    db.sequelize.sync().then(function () {
        hapiServer.start();//开启服务
        redis.init(db);
        // redis.getToken();//创建token
        console.log('server stared at port:' + PORT);
    }).catch(function (err) {
        console.log("model 同步出现错误:" + err.message);
    });
}
init();






