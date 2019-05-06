import Config from "../Config";
import ConfigError from "../Error";
import kindOf = require("../modules/kind-of");
import _in = require("./_in");

function methodsFrom(
  config: Config,
  sourcepath: string | string[],
  to: string,
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

  const toType = kindOf(to);

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

  if (toType === "string") {
    to = to.trim();
  }

  if (toType === "undefined") {
    to = ".";
  }

  config._pushFromItem({ sourcepath, to });

  return config;
}

export default methodsFrom;
