const Discord = require('discord.js');
const csv = require('csvtojson');
const player = require('../libs/player.js');
const { readFile } = require('fs').promises;

function init() {
    player.load();
}

function displayHelp(msg) {
    readFile('./assets/player_help.md', {encoding: 'utf8'})
      .then((data) => {
        const embed = new Discord.MessageEmbed()
          .setTitle('Aide de la commande @player')
          .setDescription(data);
        msg.channel.send(embed);
      });
}

async function handle(command, msg) {
  if (command !== 'player') {
    return;
  }

  var params = msg.content.split(' ');

  if (params.length <= 1 || params[1] === 'help') {
    displayHelp(msg);
    return;
  }
  params.shift();
  var cmd = params.shift();
  var guild_id = msg.channel.guild.id;
  var user_id = msg.author.id;
  switch(cmd) {
    case 'save':
        msg.channel.send(player.save(user_id, guild_id));
    break;
    case 'alias':
    case 'add':
        if(params.length < 1)
        {
            msg.channel.send('Vous devez préciser un nom de joueur');
            return;
        }
        var player_name = cleanString(params.join(' '), 32);
        if(player_name == '')
        {
            msg.channel.send('Veuillez renseigner un nom de joueur valide');
            return;
        }
        if(cmd == 'alias')
            msg.channel.send(player.alias(user_id, guild_id, player_name));
        else
            msg.channel.send(player.add(user_id, guild_id, player_name));
    break;
    case 'set':
        if(params.length < 2)
        {
            msg.channel.send('Vous devez préciser un attribut et une valeur entière');
            return;
        }
        var value = parseInt(params.pop());
        if(isNaN(value))
        {
            msg.channel.send('Le dernier paramètre doit être une valeur entière');
            return;
        }
        var tag = cleanString(params.join(' '), 32);
        if(tag == '')
        {
          msg.channel.send('Veuillez renseigner un tag valide');
          return;
        }
        msg.channel.send(player.set(user_id,guild_id,tag,value));
    break;
    case 'info':
        var result = player.info(user_id,guild_id);
        if (typeof result === 'string' || result instanceof String)
        {
            msg.channel.send(result);
            return;
        }
        var message = 'Joueur : ' + result.name;
        for(var i in result.tags)
        {
            message += "\n- "+i+" : "+result.tags[i];
        }
        msg.channel.send(message);
    break;
    case 'list':
        var result = player.list(guild_id);
        if (typeof result === 'string' || result instanceof String)
        {
            msg.channel.send(result);
            return;
        }
        var message = 'Listes des joueurs (' + result.length + ')';
        for(var i in result)
        {
            message += "\n- "+i;
        }
        msg.channel.send(message);
    break;
    default:
        displayHelp(msg);
    break;
  }
}
function cleanString(string, max_len)
{
    string = string.replace(/[^a-zA-Z ]/g, ' ').replace(/\s+/g, ' ').trim();
    if(string.length > max_len)
    {
        string = string.substring(0,max_len);
    }
    return string;
}
module.exports = {
  init,
  handle,
};
