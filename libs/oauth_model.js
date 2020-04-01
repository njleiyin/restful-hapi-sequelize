
/**
 * Created by leiyin on 2020/03/13.
 * oauth2 认证
 */
const _ = require('lodash');
const bcrypt = require('bcrypt');

module.exports = function (db) {

    const User = db.User;
    const App = db.App;
    const OAuthAccessToken = db.OAuthAccessToken;
    const OAuthRefreshToken = db.OAuthRefreshToken;

    function getAccessToken(bearerToken) {
        console.log('token验证第一步:getAccessToken')
        return new Promise(function (resolve, reject) {
            db.cache.client.get(`AccessToken_${bearerToken}`, function (err, value) {
                let result = "";
                try {
                    if (value) {
                        result = JSON.parse(value);
                        if (result.accessTokenExpiresAt) {
                            result.accessTokenExpiresAt = new Date(result.accessTokenExpiresAt);
                        }
                    }
                    let cache_token = true;
                    if (result && result.accessToken) {
                        cache_token = true;
                    } else {
                        cache_token = false;
                    }
                    if (cache_token) {
                        resolve(result);
                    } else {
                        OAuthAccessToken
                            .findOne({
                                where: { access_token: bearerToken },
                                attributes: [['access_token', 'accessToken'], ['expires', 'accessTokenExpiresAt'], 'scope', 'type', 'user_id'],
                                include: [{
                                    model: App,
                                }]
                            })
                            .then(function (accessToken) {
                                if (!accessToken) return reject(false);
                                return User.findOne({
                                    where: { user_id: accessToken.user_id },
                                }).then(function (item) {
                                    if (!item) return false;
                                    let token = accessToken.toJSON();
                                    let user = item.toJSON();
                                    delete user.password;
                                    token.user = user;
                                    token.client = token.App;
                                    token.scope = token.scope;
                                    token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt)
                                    db.cache.client.set(`AccessToken_${bearerToken}`, JSON.stringify(token));
                                    db.cache.client.expireat(`AccessToken_${bearerToken}`, Math.round(token.accessTokenExpiresAt.getTime() / 1000));
                                    return resolve(token);
                                })
                            })
                    }
                } catch (ex) {
                    console.log("----------------------check token error:-----------------------------");
                    console.log(ex);
                    reject(false)
                }
            })
        })
    }
    function getClient(clientId, clientSecret) {
        console.log('获取token第一步:getClient')
        const options = {
            where: {
                app_id: clientId,
                secret: clientSecret
            },
            attributes: ['app_id', 'name']
        };
        return App
            .findOne(options)
            .then(function (client) {
                if (!client) return new Error("client not found");
                let clientWithGrants = client.toJSON();
                clientWithGrants.grants = ['authorization_code', 'password', 'refresh_token', 'client_credentials'];
                clientWithGrants.redirectUris = [clientWithGrants.redirect_uri];
                delete clientWithGrants.redirect_uri;
                return clientWithGrants
            }).catch(function (err) {
                console.log("getClient - Err: ", err)
            });
    }
    function getUser(username, password) {
        console.log('获取token第二步:getUser')
        return User.findOne({
            where: { loginname: username },
        }).then(function (user) {
            if (!user) return false;
            let item = user.toJSON();

            if (bcrypt.compareSync(password, user.password)) {
                delete item.password;
                return item;
            } else {
                return false;
            }
        })
    }
    function revokeToken(token) {
        console.log('刷新token第三步:revokeToken')
        return OAuthRefreshToken.findOne({
            where: {
                refresh_token: token.refreshToken
            }
        }).then(function (rT) {
            if (rT) rT.destroy();
            let expiredToken = token
            expiredToken.refreshTokenExpiresAt = new Date('2015-05-28T06:59:53.000Z')
            return expiredToken
        }).catch(function (err) {
            console.log("revokeToken - Err: ", err)
        });
    }
    function saveToken(token, client, user) {
        console.log("获取token第三步:saveToken");
        return Promise.all([
            OAuthAccessToken.create({
                access_token: token.accessToken,
                expires: token.accessTokenExpiresAt,
                app_id: client.app_id,
                user_id: user.user_id,
                scope: token.scope
            }),
            token.refreshToken ? OAuthRefreshToken.create({ // no refresh token for client_credentials
                refresh_token: token.refreshToken,
                expires: token.refreshTokenExpiresAt,
                app_id: client.app_id,
                user_id: user.user_id,
                scope: token.scope
            }) : [],

        ])
            .then(function (resultsArray) {
                return _.assign(  // expected to return client and user, but not returning
                    {
                        client: client,
                        user: user,
                        access_token: token.accessToken, // proxy
                        refresh_token: token.refreshToken, // proxy
                    },
                    token
                )
            })
            .catch(function (err) {
                console.log("revokeToken - Err: ", err)
            });
    }
    function getRefreshToken(refreshToken) {
        console.log("刷新token第二步:getRefreshToken");
        if (!refreshToken || refreshToken === 'undefined') return false

        return OAuthRefreshToken
            .findOne({
                attributes: ['app_id', 'user_id', 'type', 'expires'],
                where: { refresh_token: refreshToken },
                include: [{
                    model: App
                }]
            }).then(function (token) {
                return User.findOne({
                    where: { user_id: token.user_id },
                }).then(function (item) {
                    if (!item) return false;
                    let user = item.toJSON()
                    delete user.password;
                    token.user = user;
                    return token;
                });
            }).then(function (token) {
                let tokenTemp = {
                    user: token.user,
                    client: token.App,
                    refreshTokenExpiresAt: token ? new Date(token.expires) : null,
                    refreshToken: refreshToken,
                    refresh_token: refreshToken,
                    scope: token.scope
                };
                return tokenTemp;

            }).catch(function (err) {
                console.log("getRefreshToken - Err: ", err)
            });
    }
    function validateScope(token, scope) {
        return true;//token.scope === scope
    }
    return {
        getAccessToken: getAccessToken,
        getClient: getClient,
        getRefreshToken: getRefreshToken,
        getUser: getUser,
        revokeToken: revokeToken,
        saveToken: saveToken,//saveOAuthAccessToken, renamed to
        validateScope: validateScope
    };
};


