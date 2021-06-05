function cast(player, card) {
    if(!('ka' in card) || card.ka == '')
    {
        return "Pas de KA element précisé pour la carte";
    }
    if(!('degree' in card) || card.degree == '')
    {
        return "Pas de Degré précisé pour la carte";
    }
    var tags = {};
    if(!getTag(tags, card.type, player.tags)) {
        return player.name + " ne peux pas lancer les cartes : " + card.type ;
    }

    if(!getTag(tags, card.ka, player.tags)) {
        return player.name + " ne semble pas animé du " + card.ka ;
    }
    var otherTags = '';
    if(('tags' in card) && card.tags != '')
    {
        console.log('in');
        var cardtags = card.tags.split(',')
        for(key in cardtags)
        {
            if(!getTag(tags, cardtags[key], player.tags))
            {
                if(otherTags != '')otherTags+=',';
                otherTags+=cardtags[key];
            }
        }
    }
    var r = card.ka + ' degré ' + card.degree + "\n" + player.name + ' : ';
    var result = 0;
    for(var tag in tags)
    {
        if(result != 0) r += ' + ';
        r +=  tags[tag] + ' (' + tag + ')';
        result += parseInt(tags[tag]);
    }
    result -= parseInt(card.degree);
    r += ' - '+card.degree;
    r += "\n" + 'Result : !n' + result;
    if( result < 1) r += '. Ce sort n\'est pas à la portée de '+user.username;
    if(otherTags != '') {
        r+= "\nAutres tags : " +  otherTags;
    }
    return r;
}

function getTag(tags, tag, player)
{
    if(!(tag in player) || player[tag] == '' || player[tag] < 1)
    {
        return false;
    }
    tags[tag] = player[tag];
    return true;
}


module.exports = {
  cast,
};