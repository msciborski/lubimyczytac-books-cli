const lubimyCzytacFetch = require('lubimyczytac-books');

const { argv } = require('yargs')
  .command('search', 'Search book in lubimyczytac.pl', {
    phrase: {
      describe: 'Phrase to search',
      demand: true,
      alias: 'p',
    },
  });

const command = argv._[0];

const pageUrls = {
  prevPageUrl: undefined,
  nextPageUrl: undefined,
};

const interact = async () => {
  switch (command) {
    case 'search': {
      const { phrase } = argv;
      const booksList = await lubimyCzytacFetch.getBooksForPhrase(phrase);
      pageUrls.nextPageUrl = booksList.nextPageUrl;
      pageUrls.prevPageUrl = booksList.prevPageUrl;

      break;
    }
    default:
      console.log(`Command ${command} not found.`);
      break;
  }
};

module.exports.interact = interact;
