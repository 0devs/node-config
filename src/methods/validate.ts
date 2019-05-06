import kindOf = require("../modules/kind-of");

import ConfigError from "../Error";
import Config from "../Config";

const methodsValidate = (config: Config) => {
  return new Promise(((resolve, reject) => {
    if (config.__validation) {
      config._debug("validate: call validation function");

      const promise = config.__validation(config.__data);

      if (
        !promise
        || kindOf(promise.then) !== "function"
        || kindOf(promise.catch) !== "function"
      ) {
        return reject(new ConfigError(
          ConfigError.CODES.INVALID_VALIDATION_FUNCTION,
        ));
      }

      promise
        .then((valid) => {
          config._debug("validate: validation function promise resolved");
          config.__data = valid;
          config.__valid = true;
          resolve();
        })
        .catch((error) => {
          config._debug(
            "validate: validation function promise rejected with message = ",
            error.message,
            "and code = ",
            error.code,
          );

          reject(new ConfigError(ConfigError.CODES.INVALID_DATA, error));
        });
    } else {
      config._debug("validate: no validation function, resolve");
      config.__valid = true;
      resolve();
    }

    return undefined;
  }));
};

export default methodsValidate;
