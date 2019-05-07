import Config from "../../Config";
import ConfigError from "../../Error";

import searchPlugins from "./searchPlugins";
import read = require("./read");

module.exports = function methodsReceiveIndex(config: Config) {
  return new Promise((resolve, reject) => {
    config._debug("receive: start receive sources");

    if (config.__from.length === 0) {
      config._debug("receive: no from, resolve");
      return resolve();
    }

    // search plugin for sources
    const founded = searchPlugins(config, ConfigError);

    // read sources
    const promises = read(config, ConfigError, founded);

    Promise.all(promises)
      .then((result) => {
        founded.forEach(({ from }, i) => {
          const data = result[i];
          config.set(from.to, data);
        });

        resolve();
      })
      .catch((error) => {
        // TODO get error data from error
        reject(new ConfigError({
          code: ConfigError.CODES.FAILED_TO_READ_SOURCE,
          cause: error,
        }));
      });

    return undefined;
  });
};
