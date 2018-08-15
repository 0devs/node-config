module.exports = function methodsUseValidateReceivePlugin(plugin, ConfigError) {
  // validate receive plugin interface
  const props = {
    name: 'string',
    init: 'function',
    isMatch: 'function',
    read: 'function',
  };

  Object.keys(props).forEach((name) => {
    const type = String(props[name]);
    const typeOf = typeof plugin[name];

    if (typeOf !== type) {
      throw new ConfigError({
        code: ConfigError.CODES.INVALID_PLUGIN,
        message: `@0devs/config: receive plugin type:  prop "${name}" is not ${type}`,
      });
    }
  });
};
