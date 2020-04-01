const bcrypt = require('bcrypt');
module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER(14),
            comment: "用户标识",
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        loginname: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: 'Login_Name_Index',
            comment: "登录帐号"
        },
        password: {
            type: DataTypes.STRING,
            comment: "登录密码",
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        nickname: {
            type: DataTypes.STRING(100),
            comment: "昵称"
        },
        avatar_url: {
            type: DataTypes.STRING(300),
            allowNull: true,
            comment: "头像信息"
        },
        gender: {
            type: DataTypes.STRING(2),
            allowNull: true,
            comment: "性别"
        },
        address: {
            type: DataTypes.STRING(255),
            comment: "地址"
        },
        email: {
            type: DataTypes.STRING,
            comment: "电子邮件"
        },
        mobile: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: "手机号码"
        },
        signature: {
            type: DataTypes.STRING(300),
            allowNull: true,
            comment: "签名"
        },
        status: {
            type: DataTypes.INTEGER,
            comment: "状态 0禁用 1正常"
        }
    }, {
            tableName: 'organization_users',
            indexes: [
                { name: 'loginname_index', fields: ['loginname'] },
                { name: 'mobile_index', fields: ['mobile'] }
            ],
            timestamps: true,
            underscored: true,
            hooks: { //钩子定义
                beforeCreate: function (user, options) {
                    const salt = bcrypt.genSaltSync();
                    user.password = bcrypt.hashSync(user.password, salt);
                },
                beforeUpdate: function (user, options) {
                    const salt = bcrypt.genSaltSync();
                    user.password = bcrypt.hashSync(user.password, salt);
                }
            },
            classMethods: {
                associate: function (models) {
                }
            },
            instanceMethods: {
                validatePassword: function (password) {
                    console.log("password:" + password);
                    return bcrypt.compareSync(password, this.get('password'));
                }
            }
        });

    return User;
};
