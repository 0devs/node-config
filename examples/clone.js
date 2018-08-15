/* eslint-disable no-console */

const Config = require(`${__dirname}/../lib/Config`).default;

const config = new Config();

config
  .set('.', {
    server: {
      host: null,
      port: 80,
    },
    rest: {
      endpoint: '/api/v0',
    },
  })
  .setImmutable(false);

console.log('full config', config.get('.'));

const clonedConfig = config.clone('.');

console.log('clonedConfig', clonedConfig.get('.'));

const serverConfig = config.clone('server');

console.log('serverConfig immutable', serverConfig.isImmutable());

serverConfig.set('some', 1);

console.log('server config', serverConfig.get('.'));

const restConfig = config.clone('rest');

console.log('rest config', restConfig.get('.'));

/* eslint-enable no-console */
