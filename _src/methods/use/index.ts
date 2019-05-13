import Config from "../../Config";
import {IReceivePluginClass} from "../../types";
import ConfigError from "../../Error";

import validateReceivePlugin = require("./validateReceivePlugin");

const methodsUseIndex = (config: Config, Plugin: IReceivePluginClass, options: object) => {
  config._debug("use: create instance of Plugin");

  let plugin;

  try {
    plugin = new Plugin(config.logger);
    config._debug("use: plugin type", plugin.type);
  } catch (error) {
    throw new ConfigError(ConfigError.CODES.INVALID_PLUGIN, error);
  }

  if (plugin.type === "receive") {
    config._debug("use: create plugin instance of receive type");
    validateReceivePlugin(plugin, ConfigError);
    config._debug(`use: init receive plugin ${plugin.name}`);
    plugin.init(options);
    config.__receivePlugins.push(plugin);
  } else {
    throw new ConfigError({
      code: ConfigError.CODES.INVALID_PLUGIN_TYPE,
      data: { type: plugin.type },
    });
  }

  return config;
};

export = methodsUseIndex;
