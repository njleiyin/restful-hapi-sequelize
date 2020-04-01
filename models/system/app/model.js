module.exports = function(sequelize, DataTypes) {
    const App = sequelize.define('App', {
        app_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(50),
            comment: "名称"
        },
        description: {
            type: DataTypes.STRING(255),
            comment: "描述"
        },
        secret: {
            type: DataTypes.STRING(100)
        },
        permission_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: "开始权限认证"
        },
        version_code: {
            type: DataTypes.STRING(50),
            comment: '版本代码'
        },
        version_number: {
            type: DataTypes.INTEGER,
            comment: '版本号码'
        },
        package: {
            type: DataTypes.STRING(255),
            comment: "应用包的名称"
        }
    }, {
        tableName: 'system_apps',
        timestamps: true,
        underscored: true,
        classMethods: {
            associate: function associate(models) {
            }
        }
    });
    return App;
};
