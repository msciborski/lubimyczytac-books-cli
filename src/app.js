const argv = require('yargs')
  .command('search', 'Search book in lubimyczytac.pl', {
  phrase: {
    describe: 'Phrase to search',
    demand: true,
    alias: 'p'
  }
}).argv;


  const command = argv._[0];

  switch(command) {
    case 'search':
      break;
    default:
      console.log(`Command ${command} not found.`);
      break;
  }
