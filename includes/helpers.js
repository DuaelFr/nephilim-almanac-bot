const { MessageEmbed } = require('discord.js');
const Redis = require("ioredis");
const serialize = require('serialize-javascript');
const { promisify } = require("util");
const { URL } = require("url");

// Configure redis database.
const redis_uri = new URL(process.env.REDIS_TLS_URL);
const redisOptions = process.env.REDIS_TLS_URL.includes("rediss://")
  ? {
    port: Number(redis_uri.port),
    host: redis_uri.hostname,
    password: redis_uri.password,
    db: redis_uri.pathname.replace(/^\/+|\/+$/g, '') || 0,
    tls: {
      rejectUnauthorized: false,
    },
  }
  : process.env.REDIS_TLS_URL;
const redisClient = new Redis(redisOptions);
redisClient.on("error", function(error) {
  throw "Cannot connect to the database. " + error;
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
const sendError = (channel, errorMessage) => {
  const embed = new MessageEmbed()
    .setTitle('Erreur')
    .setColor(0xff0000)
    .setDescription(errorMessage);
  channel.send({embeds: [embed]});
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
