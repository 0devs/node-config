import Config from "../src/Config";
import ConfigError from "../src/Error";

describe("Config#setImmutable", () => {
  it("should mutable by default", () => {
    const config = new Config();

    // @ts-ignore
    expect(config._immutable).toEqual(false);
  });

  it("should set immutable", () => {
    const config = new Config();

    config.setImmutable(true);

    expect(config.isImmutable()).toEqual(true);
  });

  it("should set immutable false", () => {
    const config = new Config();

    config.setImmutable(true);
    config.setImmutable(false);

    expect(config.isImmutable()).toEqual(false);
  });

  it("if flag is not boolean, throw error", () => {
    const config = new Config();

    try {
      config.setImmutable(null);
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(error.code).toEqual(ConfigError.CODES.INVALID_ARGS);
    }
  });
});
