/**
 * Created by leiyin on 20/03/13.
 */

const fs = require('fs');
const path = require('path');

module.exports = function (server, models, oauth) {

    const ROUTES_FOLDER = "routes";

    fs
        .readdirSync(ROUTES_FOLDER)
        .filter(function (filename) {
            return fs.statSync(path.join(ROUTES_FOLDER, filename)).isDirectory() && !/^index\.js$/.test(filename);
        })
        .forEach(function (moduleName) {

            let module_folder = path.join(ROUTES_FOLDER, moduleName);
            fs.readdirSync(module_folder)
                .filter(function (filename) {
                    //只能加载文件名routes_***.js的文件
                    return /^routes_.*\.js$/.test(filename);
                })
                .forEach(function (routes_file) {
                    let new_routes_file = path.join(
                        '..',
                        module_folder,
                        routes_file
                    );
                    console.log("加载 Router 定义: " + new_routes_file);
                    require(new_routes_file)(server, models, oauth);
                });
        });

};
