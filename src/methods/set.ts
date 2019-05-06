import _set = require("lodash.set");

import kindOf = require("../modules/kind-of");
import _in = require("./_in");

import ConfigError from "../Error";
import Config, {Name, Value} from "../Config";

const methodsSet = (
  config: Config,
  name: Name,
  value: Value,
): Config => {
  config._debug(
    "set: name = ", name,
    "value = ", value,
    "_immutable = ", config.isImmutable(),
  );

  if (config.isImmutable() === true) {
    throw new ConfigError(ConfigError.CODES.IMMUTABLE);
  }

  const typeOfName = kindOf(name);

  config._debug("set: typeOf name = ", typeOfName);

  const nameTypes = ["string", "array"];

  if (_in(nameTypes, typeOfName) === false) {
    throw new ConfigError({
      code: ConfigError.CODES.INVALID_ARGS,
      data: {
        method: "set",
        arg: "name",
        type: "string, array",
      },
    });
  }

  if (typeOfName === "string") {
    // @ts-ignore
    name = name.trim();
  }

  const typeOfValue = kindOf(value);

  config._debug("set: typeOf value = ", typeOfValue);

  const valueTypes = ["null", "array", "string", "number", "object", "boolean"];

  if (_in(valueTypes, typeOfValue) === false) {
    throw new ConfigError({
      code: ConfigError.CODES.INVALID_ARGS,
      data: {
        method: "set",
        arg: "value",
        type: "null, array, string, number, object, boolean",
      },
    });
  }

  if (name === ".") {
    config.__data = value;
  } else {
    _set(config.__data, name, value);
  }

  return config;
};

export default methodsSet;
