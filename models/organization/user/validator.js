const Joi = require('@hapi/joi');

const Status = {
    404: Joi.string().max(50).required().description('未找到服务器资源'),
    500: Joi.string().max(50).required().description('内部服务器错误')
};

const PREFIX = "user";
const Model = {
    user_id: Joi.number().required().description('用户标识'),
    loginname: Joi.string().max(50).allow(['', null]).description('登录名'),
    nickname: Joi.string().allow(['', null]).description('昵称'),
    avatar_url: Joi.string().allow(['', null]).description('头像图片url'),
    gender: Joi.string().allow(['', null]).description('性别'),
    email: Joi.string().allow(['', null]).description('电子邮件'),
    mobile: Joi.string().allow(['', null]).description('手机号码'),
    address: Joi.string().allow(['', null]).description('地址'),
    signature: Joi.string().allow(['', null]).description('签名'),
    status: Joi.number().allow(['', null]).description('状态 0禁用 1正常'),
    rolemembers:Joi.array().allow(['', null]).description('角色'),
    created_at: Joi.date().allow(null).description('创建日期'),
    updated_at: Joi.date().allow(null).description('更新日期'),
    name: Joi.string().allow(['', null]).description('角色名称'),
    description: Joi.string().allow(['', null]).description('角色描述')
};

const RequestModel = {
    loginname: Joi.string().max(50).allow('', null).description('登录名'),
    password: Joi.string().max(50).allow('', null).description('密码'),
    nickname: Joi.string().allow(['', null]).description('昵称'),
    avatar_url: Joi.string().allow(['', null]).description('头像图片url'),
    gender: Joi.string().allow(['', null]).default('男').description('性别'),
    email: Joi.string().allow(['', null]).description('电子邮件'),
    address: Joi.string().allow(['', null]).description('地址'),
    mobile: Joi.string().allow(['', null]).description('手机号码'),
    signature: Joi.string().allow(['', null]).description('签名'),
    status: Joi.number().allow(['', null]).description('状态 0禁用 1正常')
};

module.exports = {
    //获取指定标识对象数据的请求响应消息体
    get : {
        request: {
            params: {
                user_id: Joi.number().min(1).required().description('用户标识')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().description("返回代码"),
                message: Joi.string().description('返回信息'),
                rows: Joi.object(Model)
                    .meta({ className: PREFIX + "GetResponseData" })
                    .allow(null)
                    .description("用户信息")
            }).meta({ className: PREFIX + "GetResponse" }).required().description("返回消息体")
        }
    },
    //按分页方式获取对象数据的请求响应消息体
    list: {
        request: {
            query: {
                page_size: Joi.number().integer().min(0).default(10).description('分页大小'),
                page_number: Joi.number().integer().min(0).default(1).description('分页页号')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息'),
                total: Joi.number().integer().description('数据总数'),
                rows: Joi.array().items(Joi.object(Model).meta({className:  PREFIX + "ListResponseData"}))
            }).meta({ className:  PREFIX + "ListResponse"}).required().description("返回消息体")
        }
    },
    //创建新的对象数据的请求响应消息体
    create: {
        request: {
            payload: Joi.object(RequestModel).meta({className:  PREFIX + 'PostRequest'})
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().description("返回代码"),
                message: Joi.string().description('返回信息'),
                rows: Joi.object(Model)
                    .meta({ className: PREFIX + "GetResponseData" })
                    .allow(null)
                    .description("用户信息")
            }).meta({ className: PREFIX + "GetResponse" }).required().description("返回消息体"),
            status: Status
        }
    },
    //更新指定标识对象数据的请求响应消息体
    put: {
        request: {
            params: {
                user_id: Joi.string().max(10).required().description('用户标识')
            },
            payload: Joi.object(RequestModel).meta({className:  PREFIX + 'PutRequest'})
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息, 默认:OK')
            }).meta({ className:  PREFIX + "PutResponse"}).required().description("返回消息体"),
            status: Status
        }
    },
    //删除指定标识对象数据的请求响应消息体
    delete: {
        request: {
            params: {
                user_id: Joi.string().max(10).required().description('用户标识')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息')
            }).meta({ className:  PREFIX + "DeleteResponse"}).required().description("返回消息体"),
            status: Status
        }
    },
 };