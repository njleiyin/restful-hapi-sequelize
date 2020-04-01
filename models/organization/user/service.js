const _ = require('lodash');

let Service = function (db) {
    this.db = db;
    this.attributes = ['user_id', 'loginname', 'nickname', 'avatar_url', 'gender', 'address', 'email', 'mobile', 'updated_at', 'signature', 'status'];
};
Service.prototype.list =async function (where, page_size, page_number, order) {

    let options = {
        attributes: this.attributes,
        where: where,
        order: order
    };
    //如果分页参数中有一个等于0, 则获取全部数据
    if (page_size > 0 && page_number > 0) {
        options.limit = page_size;
        options.offset = page_size * (page_number - 1);
    }
    return this.db.User.findAndCountAll(options);
};

Service.prototype.get = function (where) {

    let option = {
        where: where,
        attributes: this.attributes
    };

    return this.db.User.findOne(option);
};

Service.prototype.create = function (data) {

    let self = this;
    return self.db.User.build(data).save().then(function (item) {
        return self.get({ user_id: item.user_id });
    });
};

Service.prototype.delete = function (where) {

    return this.db.User.findOne({ where: where }).then(function (item) {
        return item.destroy();
    });
};

Service.prototype.update = function (where, data) {
    return this.db.User.update(data, { where: where });
};

module.exports = Service;