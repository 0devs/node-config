import Zerror from "@0devs/error";

/**
 * config error class with codes
 */
class ConfigError extends Zerror {
  public static CODES = {
    INVALID_LOGGER: "invalid logger",
    INVALID_VALIDATION_FUNCTION: "invalid validation function",
    INVALID_ARGS: "invalid method arguments",
    INVALID_DATA: "invalid data",
    INVALID_PLUGIN: "invalid plugin",
    INVALID_PLUGIN_TYPE: "invalid plugin typr",
    INVALID_PLUGIN_READ: "invalid plugin read function, should return promise",
    IMMUTABLE: "config is immutable, see .setImmutable method",
    UNKNOWN_SOURCE_TYPE: "inknown source type, no plugin for source",
    FAILED_TO_READ_SOURCE: "failed to read source, plugin error",
  };
}

ConfigError.setCodes(ConfigError.CODES);

export default ConfigError;
