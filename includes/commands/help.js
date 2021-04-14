const { readFile } = require('fs').promises;

function handle(command, msg) {
  if (command !== 'help') {
    return;
  }

  readFile('./assets/help.md', {encoding: 'utf8'})
    .then((data) => {
      msg.channel.send(data);
    });
}

module.exports = handle;
