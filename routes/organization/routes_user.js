module.exports = function (server, models) {

    server.bind(models.organization.user.controller);

    server.route([
        {
            method: 'POST',
            path: '/organization/v1/users',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '创建新的用户信息',
                validate: models.organization.user.validator.create.request,
                response: models.organization.user.validator.create.response,
                handler: models.organization.user.controller.create
            }
        },
        {
            method: 'GET',
            path: '/organization/v1/users',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '分页方式获取获取用户列表信息',
                validate: models.organization.user.validator.list.request,
                response: models.organization.user.validator.list.response,
                notes: 'My route notes',
                handler: models.organization.user.controller.list
            }
        },
        {
            method: 'GET',
            path: '/organization/v1/users/{user_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '获取指定标识的用户信息',
                validate: models.organization.user.validator.get.request,
                response: models.organization.user.validator.get.response,
                notes: 'My route notes',
                handler: models.organization.user.controller.get
            }
        },
        {
            method: 'PUT',
            path: '/organization/v1/users/{user_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '更新指定标识的用户信息',
                validate: models.organization.user.validator.put.request,
                response: models.organization.user.validator.put.response,
                notes: 'My route notes',
                handler: models.organization.user.controller.update
            }
        },
        {
            method: 'DELETE',
            path: '/organization/v1/users/{user_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '删除指定标识的用户信息',
                validate: models.organization.user.validator.delete.request,
                response: models.organization.user.validator.delete.response,
                notes: 'My route notes',
                handler: models.organization.user.controller.delete
            }
        }
    ])
};