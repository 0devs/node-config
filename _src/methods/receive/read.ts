import kindOf = require("../../modules/kind-of");

import Config from "../../Config";
import {IFoundedReceivePlugin} from "../../types";
import ConfigError from "../../Error";

const methodsReceiveRead = (
  config: Config,
  ConfigErrorClass: typeof ConfigError,
  founded: IFoundedReceivePlugin[],
) => {
  const promises: Array<Promise<object>> = [];

  founded.forEach(({ plugin: sourcePlugin, from: sourceFrom } /* , j */) => {
    config._debug(`receive: read ${sourceFrom.sourcepath}`);

    const promise = sourcePlugin.read(sourceFrom.sourcepath);

    if (
      !promise
      || kindOf(promise.then) !== "function"
      || kindOf(promise.catch) !== "function"
    ) {
      throw new ConfigErrorClass({
        code: ConfigErrorClass.CODES.INVALID_PLUGIN_READ,
        data: {
          name: sourcePlugin.name,
        },
      });
    }

    promises.push(promise);
  });

  return promises;
};

export = methodsReceiveRead;
