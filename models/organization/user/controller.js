const Boom = require('boom');
const _ = require('lodash');

const Controller = function (service) {
    this.service = service;
};


Controller.prototype.list = function (request, reply) {
    let where = {};

    this.service.list(where, request.query.page_size, request.query.page_number, [['user_id', 'desc']]).then(async function (list) {
        let data = [];
        list.rows.forEach(function (row) {
            data.push(row.toJSON());
        });
        reply.send({ total: list.count, items: data });
    }).catch(function (err) {
        reply(err.message);
    })
};

Controller.prototype.get = function (request, reply) {

    let where = { user_id: request.params.user_id };

    this.service.get(where).then(function (row) {

        if (!row) return reply.error(Boom.notFound("找不到指定标识的数据"));

        let item = row.get();
        reply.send(item);

    }).catch(function (err) {
        reply.error(err);
    })
};

Controller.prototype.create = function (request, reply) {

    this.service.create(request.payload).then(function (result) {
        reply.send(result);
    }).catch(function (err) {
        reply.error(err);
    })
};

Controller.prototype.delete = function (request, reply) {

    let where = { user_id: request.params.user_id };

    this.service.delete(where).then(function (row) {
        reply.send();
    }).catch(function (err) {
        reply.error(err);
    })
};

Controller.prototype.update = function (request, reply) {

    let where = { user_id: request.params.user_id };

    this.service.update(where, request.payload).then(function (result) {
        reply.send();
    }).catch(function (err) {
        reply.error(err);
    })
};

module.exports = Controller;