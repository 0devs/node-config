const Config = require('../lib/Config').default;

const config = new Config();

/* eslint-disable no-console */
const log = (msg, json) => console.log(msg, '\n', JSON.stringify(json, null, 2));
/* eslint-enable no-console */

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

log('full config', config.get('.'));

const clonedConfig = config.clone('.');
log('clonedConfig', clonedConfig.get('.'));

const serverConfig = config.clone('server');
log('serverConfig immutable', serverConfig.isImmutable());

serverConfig.set('some', 1);
log('server config', serverConfig.get('.'));

const restConfig = config.clone('rest');
log('rest config', restConfig.get('.'));
