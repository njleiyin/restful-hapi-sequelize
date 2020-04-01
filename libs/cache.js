/**
 * Created by leiyin on 2020/03/09.
 * redis实例化
 */
const redis = require("redis");
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let redis_option = {};
if (process.env.MP_REDIS_HOST)
    redis_option.host = process.env.MP_REDIS_HOST;
if (process.env.MP_REDIS_PORT)
    redis_option.port = process.env.MP_REDIS_PORT;

let client = redis.createClient(redis_option);
client.on("error", function (err) {
    console.log("Redis Error " + err);
});
module.exports = {
    client: client,
    redis: redis
}