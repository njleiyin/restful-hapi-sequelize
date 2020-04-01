/**
 * Created by leiyin on 2020/03/13.
 * sequelize连接数据库，同步model
 * 连接redis
 */
const fs = require('fs');
const path = require('path');
const cache = require('./cache.js');
const Sequelize = require('sequelize');

//数据模块文件的根目录
const MODULES_FOLDER = 'models';

module.exports = function (settings) {
    let sequelize = new Sequelize(settings.database, settings.username, settings.password, settings.options);
    let db = {
        sequelize: sequelize,
        Sequelize: Sequelize,
        cache:cache
    };
    //读取根目录下文件
    fs.readdirSync(MODULES_FOLDER)
        .filter(function (filename) {
            //过滤 必须是文件夹
            return fs.statSync(path.join(MODULES_FOLDER, filename)).isDirectory();
        })
        .forEach(function (moduleName) {
            let module_folder = path.join(MODULES_FOLDER, moduleName);
            //读取文件夹下的文件
            fs.readdirSync(module_folder)
                .filter(function (filename) {
                    //过滤 必须是文件夹
                    return fs.statSync(path.join(module_folder, filename)).isDirectory();
                })
                .forEach(function (moduleDirectory) {
                    //读取文件夹下的文件
                    let model_folder = path.join(module_folder, moduleDirectory);
                    fs.readdirSync(model_folder)
                        .filter(function (filename) {
                            //过滤 文件名必须叫model.js
                            return /^model\.js$/.test(filename);
                        })
                        .forEach(function (modelFilename) {
                            let modelPath = path.join('..', module_folder, moduleDirectory, modelFilename);
                            console.log("加载 model 定义: " + moduleDirectory);
                            let model = sequelize.import(modelPath);
                            db[model.name] = model;
                        });
                })
        });

    Object.keys(db).forEach(function (modelName) {
        if ('associate' in db[modelName]) {
            console.log('modelName', modelName)
            db[modelName].associate(db);
        }
    });
    return db;
};