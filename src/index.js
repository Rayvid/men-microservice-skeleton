// TODO: run app as http server, it has ways to be closed normally at runtime.
// const config = require('./config');
// const app = require('./web');
// const logger = require('./util/logger');

const init = () => {
  // const server = http.createServer(app);
  // server.listen(config.server.port);
  // server.on('error', onError);
  // server.on('listening', onListening);
};

// const onError = (error) => {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }
//
//   logger.error('Could not init the app:', error);
//   process.exit(1);
// };
//
// const onListening = async () => {
//   logger.info('Starting app on port', config.server.port, { pid: process.pid });
// };

// process.on('unhandledRejection', (err) => {
//   logger.error(err);
//   process.exit(1);
// });

module.exports = { init };
