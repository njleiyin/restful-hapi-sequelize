/**
 * Created by leiyin on 2020/03/10.
 */

const fs = require('fs');
const path = require('path');

module.exports = function (db) {
    //根目录
    const MODELS_FOLDER = "models";
    //对象结果集
    let result = {};
    //读取目录
    fs.readdirSync(MODELS_FOLDER)
        .filter(function (filename) {
            //过滤 必须是目录
            return fs.statSync(path.join(MODELS_FOLDER, filename)).isDirectory();
        })
        .forEach(function (prefix_name) {
            let prefix_folder = path.join(MODELS_FOLDER, prefix_name);
            result[prefix_name] = {};
            fs.readdirSync(prefix_folder)
                .filter(function (filename) {
                    //过滤 必须是目录
                    return fs.statSync(path.join(prefix_folder, filename)).isDirectory()
                })
                .forEach(function (model_name) {
                    let model_folder = path.join(prefix_folder, model_name);
                    try {
                        //通用控制器、服务、验证文件
                        let controller_file = path.join(model_folder, "controller.js");
                        let service_file = path.join(model_folder, "service.js");
                        let validator_file = path.join(model_folder, "validator.js");
                        //判断控制器、服务、验证文件是否都存在 存在则初始化
                        if (fs.statSync(controller_file).isFile()
                            && fs.statSync(service_file).isFile()
                            && fs.statSync(validator_file).isFile()) {
                            //定义控制器、服务、验证对象
                            let Controller = require(path.join("..", controller_file));
                            let Service = require(path.join("..", service_file));
                            //实例化控制器、服务对象
                            let service = new Service(db);
                            let controller = new Controller(service);
                            let validator = require(path.join("..", validator_file));
                            //绑定目录名对象到结果集
                            result[prefix_name][model_name] = { controller: controller, service: service, validator: validator };
                        }
                    } catch (e) {
                        if (e.errno != -4058) {
                            // console.log(model_name);
                            // console.log(e);
                        }
                    }
                });
        });
    return result;
};