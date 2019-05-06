const kindOf = require('../../modules/kind-of');

module.exports = function methodsReceiveRead(config, ConfigError, founded) {
  const promises = [];

  founded.forEach(({ plugin: sourcePlugin, from: sourceFrom } /* , j */) => {
    config._debug(`receive: read ${sourceFrom.sourcepath}`);

    const promise = sourcePlugin.read(sourceFrom.sourcepath);

    if (
      !promise
      || kindOf(promise.then) !== 'function'
      || kindOf(promise.catch) !== 'function'
    ) {
      throw new ConfigError({
        code: ConfigError.CODES.INVALID_PLUGIN_READ,
        data: {
          name: sourcePlugin.name,
        },
      });
    }

    promises.push(promise);
  });

  return promises;
};
