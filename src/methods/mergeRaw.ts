import _merge = require("lodash.merge");

import kindOf = require("../modules/kind-of");
import _in = require("./_in");

import ConfigError from "../Error";
import Config from "../Config";

const methodsMergeRaw = (config: Config, source: any): Config => {
  config._debug("mergeRaw: source = ", source);

  const typeOfSource = kindOf(source);

  config._trace("mergeRaw: typeOf source = ", typeOfSource);

  if (_in(["object", "array"], typeOfSource) === false) {
    throw new ConfigError({
      code: ConfigError.CODES.INVALID_ARGS,
      data: {
        method: "mergeRaw",
        arg: "source",
        type: "object, array",
      },
    });
  }

  const data = _merge(config.__data, source);

  config.setRaw(".", data);

  return config;
};

export default methodsMergeRaw;
