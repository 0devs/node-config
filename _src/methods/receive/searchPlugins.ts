import Config from "../../Config";
import {IFoundedReceivePlugin} from "../../types";
import ConfigError from "../../Error";

import searchReceivePlugin = require("./searchReceivePlugin");

const methodsReceiveSearchPlugins = (config: Config, ConfigErrorClass: typeof ConfigError) => {
  const founded: IFoundedReceivePlugin[] = [];

  config.__from.forEach((from) => {
    config._debug("receive: search plugin for ", from.sourcepath);

    const plugin = searchReceivePlugin(config.__receivePlugins, from.sourcepath);

    if (!plugin) {
      throw new ConfigError({
        code: ConfigError.CODES.UNKNOWN_SOURCE_TYPE,
        data: { sourcepath: from.sourcepath },
      });
    }

    config._debug(`receive: found plugin "${plugin.name}" for "${from.sourcepath}"`);

    founded.push({ from, plugin });
  });

  return founded;
};

export default methodsReceiveSearchPlugins;
