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

switch (command) {
  case 'search': {
    const { phrase } = argv;
    APIFetch.getBooks(phrase)
      .then(books => Promise.all(books)
        .then(book => console.log(book)));
    break;
  }
  default:
    console.log(`Command ${command} not found.`);
    break;
}
