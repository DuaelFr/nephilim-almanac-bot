
function handle(msg) {
  if (msg.content === '@help') {
    let response = [];
    response.push('**Obtenir l\'almanach du jour** :');
    response.push('Permet de connaître le jour de la semaine, son élément et les conjonctions potentielles.');
    response.push('Syntaxe : @JJ/MM/YYYY');
    response.push('Exemples : @01/01/2017 ou @30/06/-152');
    msg.channel.send(response.join("\n"));
  }
}

module.exports = handle;
