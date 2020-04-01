module.exports = function (sequelize, DataTypes) {
    const OAuthRefreshToken = sequelize.define('OAuthRefreshToken', {
        id: {
            type: DataTypes.INTEGER(14),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        refresh_token: DataTypes.STRING(256),
        expires: DataTypes.DATE,
        scope: DataTypes.STRING,
        type: { type: DataTypes.INTEGER },
        user_id: { type: DataTypes.INTEGER },
    }, {
        tableName: 'oauth_refresh_tokens',
        timestamps: false,
        underscored: true,
    });
    OAuthRefreshToken.associate = function (models) {
        OAuthRefreshToken.belongsTo(models.App, {
            foreignKey: 'app_id'
        });
    }
    return OAuthRefreshToken;
};
