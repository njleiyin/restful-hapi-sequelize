/**
 * Created by leiyin on 2020/03/09.
 * redis初始化方法
 */
const client = require('restler');
const _ = require('lodash');
const Boom = require('boom');

module.exports = {
    init: async (db) => {
        let default_uesr = {
            loginname: 'admin',
            password: 'admin',
            nickname: '系统管理员',
            gender: 1
        }
        //初始化默认用户
        db.User.findOrCreate({ where: { loginname: 'admin' }, defaults: default_uesr }).then(([user, created]) => {
            console.log('默认用户初始化成功')
        })
        let default_app = {
            app_id: 'adminapp',
            name: 'adminapp',
            description: 'adminapp',
            secret: 'adminapp',
            permission_enabled: 0,
            version_code: 1.0,
            version_number: 1
        }
        //初始化默认app
        db.App.findOrCreate({ where: { app_id: 'adminapp' }, defaults: default_app }).then(([user, created]) => {
            console.log('默认app初始化成功')
        })
    },
    //获取系统管理员token
    getToken: async () => {
        let posturl = "http://localhost:3002/oauth/token"
        let postbody = {
            username: 'admin',
            password: 'admin',
            grant_type: 'password'
        }
        let signature = Buffer.from('adminapp:adminapp').toString('base64');
        client.post(posturl, {
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + signature
            },
            data: postbody
        }).on('complete', function (result, res) {
            if (!result.access_token) {
                return Boom.badRequest('获取token失败，请稍后重试！');
            }
            console.log('token创建成功')
        });
    }
} 