const hapiToExpress = require('hapi-to-express');
const Boom = require('boom');
const oauthServer = require('oauth2-server');
const Request = oauthServer.Request;
const Response = oauthServer.Response;

module.exports = function(server, models, oauth){
    server.route([
        {
            method: 'POST',
            path: '/oauth/token',
            config: {
                tags: ['api'],
                handler: function (request, reply) {
                    let hapress = hapiToExpress(request, reply);
                    let express_req = new Request(hapress.req);
                    let express_res = new Response(hapress.res);
                    oauth.token(express_req, express_res)
                        .then(function (token) {
                            token.expires_in = 3600 * 24 * 7;
                            return reply(token);
                        })
                        .catch(function (err) {
                            console.log("err:" + JSON.stringify(err));
                            return reply.error(Boom.badImplementation(err.message, err));;
                        })
                }
            }
        }
    ])
};