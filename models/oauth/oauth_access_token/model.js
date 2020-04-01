module.exports = function (sequelize, DataTypes) {
    const OAuthAccessToken = sequelize.define('OAuthAccessToken', {
        id: {
            type: DataTypes.INTEGER(14),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        access_token: DataTypes.STRING(256),
        expires: DataTypes.DATE,
        scope: DataTypes.STRING,
        type: { type: DataTypes.INTEGER },
        user_id: { type: DataTypes.INTEGER },
    }, {
        tableName: 'oauth_access_tokens',
        indexes: [
            { name: 'type_index', fields: ['type'] },
            { name: 'user_index', fields: ['user_id'] }
        ],
        timestamps: false,
        underscored: true,
    });

    OAuthAccessToken.associate = function (models) {
        OAuthAccessToken.belongsTo(models.App, {
            foreignKey: 'app_id'
        });
    }
    return OAuthAccessToken;
};