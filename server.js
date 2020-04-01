/**
 * Created by leiyin on 2020/03/10.
 * hapi服务搭建
 */

const Hapi = require('hapi');
const hapiToExpress = require('hapi-to-express');
const Boom = require('boom');
const _ = require('lodash');

const oauthServer = require('oauth2-server');
let Request = oauthServer.Request;
let Response = oauthServer.Response;

module.exports = async function (port, db) {
    let oauth = new oauthServer({
        model: require('./libs/oauth_model.js')(db),
        accessTokenLifetime: 3600 * 24 * 7,
        refreshTokenLifetime: 3600 * 24 * 7
    });
    //实例化hai服务
    let hapiServer = new Hapi.Server();
    hapiServer.connection({
        port: port,
        routes: {
            cors: {
                origin: ['*'],
                additionalHeaders: ["Accept-Language", "Corporation-Id"]
            }
        },
        labels: ['api']
    });

    hapiServer.oauth = oauth;

    const reply_send = function (data) {
        if (data instanceof Object) {
            if (data.hasOwnProperty('total') && data.hasOwnProperty('items')) {
                return this.response({ code: 200, message: "OK", total: data.total, rows: data.items });
            } else {
                if (data.toJSON) {
                    return this.response({ code: 200, message: "OK", rows: data.toJSON() });
                } else {
                    return this.response({ code: 200, message: "OK", rows: data });
                }
            }
        }
        return this.response({ code: 200, message: "OK" });
    };
    const reply_error = function (boom) {
        return this.response({ code: boom.output.statusCode, message: boom.output.payload.message }).code(boom.output.statusCode);
    };

    //为reply增加扩展方法,返回统一的数据格式
    hapiServer.decorate('reply', 'send', reply_send);
    hapiServer.decorate('reply', 'error', reply_error);

    hapiServer.register([
        require('inert'),
        require('vision'),
        {
            register: require('hapi-swaggered'),
            options: {
                tags: {
                    'test': "测试用例",
                    'organization': "组织",
                },
                info: {
                    title: '企业基础SaaS平台',
                    description: '为企业提供基础软件即服务的平台',
                    version: '1.0'
                }
            }
        },
        {
            register: require('hapi-swaggered-ui'),
            options: {
                title: '企业基础SaaS平台',
                path: '/docs',
                authorization: {
                    field: 'Authorization',
                    scope: 'header', // header works as well
                    valuePrefix: 'Bearer ',
                    defaultValue: 'token',
                    placeholder: 'Enter your token here'
                },
                swaggerOptions: {
                    validatorUrl: null
                }
            }
        }])

    //重定向到api文档页面
    hapiServer.route({
        path: '/',
        method: 'GET',
        handler(request, h) {
            return h.response().redirect('/docs')
        }
    })
    //发起请求前
    const scheme = function (server, options) {
        return {
            authenticate: function (request, reply) {
                let hapress = hapiToExpress(request, reply);
                let express_req = new Request(hapress.req);
                let express_res = new Response(hapress.res);

                return oauth.authenticate(express_req, express_res, {})
                    .then(function (token) {
                        console.log('token')
                        //从token中获取通用的过滤条件
                        request.filter = {
                            app_id: token.App.app_id
                        };
                        request.filter.user = {
                            user_id: token.user.user_id,
                            login_name: token.user.loginname,
                            nickname: token.user.nickname
                        };
                        console.log("++++++++++filter+++++++++++");
                        console.log(JSON.stringify(request.filter));
                        console.log("++++++++++filter+++++++++++");
                        let language = request.headers["accept-language"]
                        if (!language) {
                            language = 'zh-cn';
                        }
                        switch (language) {
                            case 'zh-cn':
                            case 'en-us':
                            case 'ru':
                                request.filter.language = language;
                                break;
                            default:
                                request.filter.language = 'zh-cn';
                        }
                        console.log("------------------on filter------------------");
                        console.log(request.filter.language);
                        console.log("------------------on filter------------------");
                        return reply.continue({ credentials: token });
                    })
                    .catch(function (err) {
                        return reply(Boom.unauthorized());
                    });
            }
        };
    };

    hapiServer.auth.scheme('custom', scheme);
    hapiServer.auth.strategy('default', 'custom');

    process.on('unhandledRejection', (err) => {
        console.log('unhandledRejection', err);
        // process.exit(1);//退出程序
    });

    return hapiServer;
};



