const Discord = require('discord.js');
const redis = require('redis');
const serialize = require('serialize-javascript');
const { promisify } = require("util");

// Configure redis database.
let redisClientOptions = {};
if (process.env.REDIS_TLS_URL.indexOf('rediss://') === 0) {
  redisClientOptions.tls = { rejectUnauthorized: false };
}
const redisClient = redis.createClient(process.env.REDIS_TLS_URL, redisClientOptions);
redisClient.on("error", function(error) {
  throw "Impossible de joindre la base de données.";
});

// Base redis methods.
const redisGetAsync = promisify(redisClient.get).bind(redisClient);
const redisSetAsync = promisify(redisClient.set).bind(redisClient);

/**
 * Send an error message to the client.
 *
 * @param msg
 * @param errorMessage
 */
const sendError = (msg, errorMessage) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('Erreur')
    .setColor(0xff0000)
    .setDescription(errorMessage);
  msg.channel.send(embed);
}

/**
 * Get configuration values.
 *
 * @param guild
 * @param key
 * @param defaultValue
 * @returns {PromiseLike<any> | Promise<any>}
 */
const configGet = (guild, key, defaultValue = undefined) => {
  return redisGetAsync(`neph:${guild}:${key}`)
    .then((serialized) => {
      return eval('(' + serialized + ')');
    })
    .then((data) => {
      if (!data) {
        return defaultValue;
      }
      return data;
    })
    .catch((error) => {
      console.log(error);
      return defaultValue;
    });
}

/**
 * Set configuration values.
 *
 * @param guild
 * @param key
 * @param value
 * @returns {*}
 */
const configSet = (guild, key, value) => {
  return redisSetAsync(`neph:${guild}:${key}`, serialize(value))
    .catch((error) => {
      console.log(error);
    });
}

module.exports = { sendError, configGet, configSet };
