import ConfigError from "../../Error";
import {IReceivePlugin} from "../../types";

// type ValueOf<T> = T[keyof T];

const methodsUseValidateReceivePlugin = (
  plugin: IReceivePlugin,
  ConfigErrorClass: typeof ConfigError,
) => {
  // validate receive plugin interface
  const props = {
    name: "string",
    init: "function",
    isMatch: "function",
    read: "function",
  };

  Object.entries(props).forEach(([name, type]) => {
    // @ts-ignore fix types
    const typeOf = typeof plugin[name];

    if (typeOf !== type) {
      throw new ConfigErrorClass({
        code: ConfigErrorClass.CODES.INVALID_PLUGIN,
        message: `@0devs/config: receive plugin type:  prop "${name}" is not ${type}`,
      });
    }
  });
};

export = methodsUseValidateReceivePlugin;
