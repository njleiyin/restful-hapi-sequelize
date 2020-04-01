/**
 * Created by leiyin on 2020/03/10.
 */
"use strict";
const nconf = require('nconf');
nconf.argv().env();
let app_env = nconf.get('NODE_ENV');
console.log('app_env:', app_env);
if (app_env == undefined || app_env == '') {
    app_env = 'development';
}
module.exports = require('./config/' + app_env + '.json');