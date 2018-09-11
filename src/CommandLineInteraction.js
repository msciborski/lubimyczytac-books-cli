const { argv } = require('yargs')
  .command('search', 'Search book in lubimyczytac.pl', {
    phrase: {
      describe: 'Phrase to search',
      demand: true,
      alias: 'p',
    },
  });

const APIFetch = require('./APIFetch');

const command = argv._[0];

const interact = async () => {
  switch (command) {
    case 'search': {
      const { phrase } = argv;
      const booksList = await APIFetch.getBooks(phrase);
      console.log(booksList);
      break;
    }
    default:
      console.log(`Command ${command} not found.`);
      break;
  }
};

module.exports.interact = interact;
