const { readFile } = require('fs').promises;

function handle(msg) {
  if (msg.content === '@help') {
    readFile('./assets/help.md', {encoding: 'utf8'})
      .then((data) => {
        msg.channel.send(data);
      });
  }
}

module.exports = handle;
