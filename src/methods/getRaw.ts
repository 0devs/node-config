import _get = require("lodash.get");

import Config, {Name, Value, ReturnValue} from "../Config";
import ConfigError from "../Error";

import kindOf = require("../modules/kind-of");
import _in = require("./_in");

const methodsGetRaw = (
  config: Config,
  name: Name,
  defaultValue?: Value,
): ReturnValue => {
  config._debug(
    "getRaw: name = ", name,
    "defaultValue = ", defaultValue,
  );

  const typeOfName = kindOf(name);

  config._debug("getRaw: typeOf name = ", typeOfName);

  if (_in(["string", "array"], typeOfName) === false) {
    throw new ConfigError({
      code: ConfigError.CODES.INVALID_ARGS,
      data: {
        method: "getRaw",
        arg: "name",
        type: "string, array",
      },
    });
  }

  if (typeOfName === "string") {
    // @ts-ignore
    name = name.trim();
  }

  const typeOfDefaultValue = kindOf(defaultValue);

  config._debug("getRaw: typeOf value = ", typeOfDefaultValue);

  let value;

  if (name === ".") {
    value = config.__data;
    config._debug("getRaw: name == '.' return full config object");
  } else {
    config._debug(`getRaw: call lodash.get ${name}`);
    value = _get(config.__data, name, defaultValue);
  }

  config._debug("getRaw: return value", value);

  return value;
};

export default methodsGetRaw;
