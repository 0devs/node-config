import _get = require("lodash.get");

import Config, {Name, Value, ReturnValue} from "../Config";
import ConfigError from "../Error";

// var _clone = require('lodash.clonedeep');

import kindOf = require("../modules/kind-of");
import _in = require("./_in");

const _clone = function methodsGetClone(value: any): any {
  const valueType = kindOf(value);

  if (_in(["object", "array"], valueType)) {
    return JSON.parse(JSON.stringify(value));
  }

  return value;
};

const methodsGet = (
  config: Config,
  name: Name,
  defaultValue?: Value,
): ReturnValue => {
  config._debug(
    "get: name = ", name,
    "defaultValue = ", defaultValue,
  );

  const typeOfName = kindOf(name);

  config._debug("get: typeOf name = ", typeOfName);

  if (_in(["string", "array"], typeOfName) === false) {
    throw new ConfigError({
      code: ConfigError.CODES.INVALID_ARGS,
      data: {
        method: "get",
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

  config._debug("get: typeOf value = ", typeOfDefaultValue);

  const valueTypes = ["undefined", "null", "array", "string", "number", "object", "boolean"];

  if (_in(valueTypes, typeOfDefaultValue) === false) {
    throw new ConfigError({
      code: ConfigError.CODES.INVALID_ARGS,
      data: {
        method: "set",
        arg: "value",
        type: "undefined, null, array, string, number, object, boolean",
      },
    });
  }

  let value;

  if (name === ".") {
    value = config.__data;
    config._debug("get: name == '.' return full config object");
  } else {
    config._debug(`get: call lodash.get ${name}`);
    value = _get(config.__data, name, defaultValue);
  }

  config._debug("get: return value", value);

  return _clone(value);
};

export default methodsGet;
