import Config from "../Config";
import ConfigError from "../Error";
import kindOf = require("../modules/kind-of");
import _in = require("./_in");

function methodsFrom(
  config: Config,
  sourcepath: string, // | string[],
  rawTo?: string,
): Config {
  const sourcepathType = kindOf(sourcepath);

  if (_in(["string"], sourcepathType) === false) {
    throw new ConfigError({
      code: ConfigError.CODES.INVALID_ARGS,
      data: {
        method: "from",
        arg: "sourcepath",
        type: "string",
      },
    });
  }

  const toType = kindOf(rawTo);

  if (_in(["string", "array", "undefined"], toType) === false) {
    throw new ConfigError({
      code: ConfigError.CODES.INVALID_ARGS,
      data: {
        method: "from",
        arg: "to",
        type: "string, array, undefined",
      },
    });
  }

  let to = ".";

  if (rawTo && toType === "string") {
    to = rawTo.trim();
  }

  config._pushFromItem({ sourcepath, to });

  return config;
}

export default methodsFrom;
