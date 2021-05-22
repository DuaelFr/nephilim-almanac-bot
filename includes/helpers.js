const Discord = require('discord.js');
const redis = require('redis');
const serialize = require('serialize-javascript');
const { promisify } = require("util");

// Configure redis database.
const redisClient = redis.createClient(process.env.REDIS_TLS_URL);
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
 * @returns {PromiseLike<any> | Promise<any>}
 */
const configGet = (guild, key) => {
  return redisGetAsync(`neph:${guild}:${key}`)
    .then((serialized) => {
      return eval('(' + serialized + ')');
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
  return redisSetAsync(`neph:${guild}:${key}`, serialize(value));
}

module.exports = { sendError, configGet, configSet };
