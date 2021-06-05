/*
    Gère la lecture ecriture des players
*/
// const Discord = require('discord.js')
const fs = require('fs');
let loadStart = false;
let loadEnded = false;
// liste des joueurs
let players = {};
// savoir qui est qui
let aliases = {};

function load()
{
    if (loadStart) return;
    loadStart = true;
    fs.readdirSync('./assets/players/').forEach(function(file) {
      if(!file.endsWith('.json'))
      {
        return;
      }
      var rawdata = fs.readFileSync("./assets/players/" + file);
      var file_data = JSON.parse(rawdata);
      if(file == 'aliases.json')
      {
        aliases = file_data;
      }
      else
      {
        if(!(file_data.guild_id in players))
        {
            players[file_data.guild_id] = {};
        }
        players[file_data.guild_id][file_data.player_alias] = file_data.data;
      }
    });
    loadEnded = true;
    console.log('Librairie player chargée');
}

function add(user_id, guild_id, player_alias)
{
    if(!loadEnded)
    {
        return "La librairie n'est pas chargée";
    }
    if(!(guild_id in players))
    {
        players[guild_id] = {};
    }
    if(player_alias in players[guild_id])
    {
        return "Le joueur existe déjà";
    }
    players[guild_id][player_alias] = {};
    if(!(guild_id in aliases))
    {
        aliases[guild_id] = {};
    }
    // affectation de l'alias
    aliases[guild_id][user_id] = player_alias;
    saveAlias();
    return "Joueur '"+player_alias+"' créé avec succes";
}

function alias(user_id, guild_id, player_alias)
{
    if(!loadEnded)
    {
        return "La librairie n'est pas chargée";
    }
    if((!(guild_id in players)) || !(player_alias in players[guild_id]))
    {
        return "Le joueur '"+player_alias+"' n'existe pas";
    }
    if(!(guild_id in aliases))
    {
        aliases[guild_id] = {};
    }
    // affectation de l'alias
    aliases[guild_id][user_id] = player_alias;
    saveAlias();

    return "Vous êtes désormais '"+player_alias+"' ";
}

function saveAlias()
{
    if(!loadEnded)
    {
        return "La librairie n'est pas chargée";
    }
    // TODO : si async : s'assurer que les informations ne s'écrasent pas n'importe comment
    // Au pire, c'est le fichier qui dit qui est qui... Mais bon...
    let data = JSON.stringify(aliases);
    fs.writeFileSync('./assets/players/aliases.json', data);
}


function set(user_id, guild_id, tag, value)
{
    if(!loadEnded)
    {
        return "La librairie n'est pas chargée";
    }
    if((!(guild_id in aliases)) || !(user_id in aliases[guild_id]))
    {
        return "Pas de joueur configuré";
    }
    var player_alias = aliases[guild_id][user_id];
    if((!(guild_id in players)) || !(player_alias in players[guild_id]))
    {
        return "Le joueur '"+player_alias+"' s'est fait dévorer par un trou noir";
    }
    // TODO : needToBeSave List ?
    if(value > 0)
    {
        players[guild_id][player_alias][tag] = value;
        return "Valeur affectée : "+tag+" = "+value;
    }
    if(tag in players[guild_id][player_alias])
    {
        delete players[guild_id][player_alias][tag];
        return "Valeur supprimée : "+tag+" = "+value;
    }
    return "Pas de changement : "+tag+" = "+value;
}

function save(user_id, guild_id)
{
    if(!loadEnded)
    {
        return "La librairie n'est pas chargée";
    }
    if((!(guild_id in aliases)) || !(user_id in aliases[guild_id]))
    {
        return "Pas de joueur configuré";
    }
    var player_alias = aliases[guild_id][user_id];
    if((!(guild_id in players)) || !(player_alias in players[guild_id]))
    {
        return "Le joueur '"+player_alias+"' s'est fait dévorer par un trou noir";
    }
    player_data = {};
    player_data.guild_id = guild_id;
    player_data.player_alias = player_alias;
    player_data.data = players[guild_id][player_alias];
    let data = JSON.stringify(player_data);
    fs.writeFileSync('./assets/players/'+guild_id+'.'+player_alias+'.json', data);
    return "Joueur '"+player_alias+"' sauvegardé";
}

function info(user_id, guild_id)
{
    if(!loadEnded)
    {
        return "La librairie n'est pas chargée";
    }
    if((!(guild_id in aliases)) || !(user_id in aliases[guild_id]))
    {
        return "Pas de joueur configuré";
    }
    var player_alias = aliases[guild_id][user_id];
    if((!(guild_id in players)) || !(player_alias in players[guild_id]))
    {
        return "Le joueur '"+player_alias+"' s'est fait dévorer par un trou noir";
    }
    var r = {};
    r.name = player_alias;
    r.tags = players[guild_id][player_alias];
    return r;
}

function list(guild_id)
{
    if(!loadEnded)
    {
        return "La librairie n'est pas chargée";
    }
    if(!(guild_id in players))
    {
        return "Aucun joueur configuré";
    }
    return players[guild_id];
}

module.exports = {
    load,
    add,
    set,
    save,
    alias,
    info,
    list
}