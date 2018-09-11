const cli = require('./CommandLineInteraction');

try {
  cli.interact();
} catch (error) {
  console.log(error);
}
