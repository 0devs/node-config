import Config from "../src/Config";
import ConfigError from "../src/Error";

describe("Config#from", () => {
  it('should exec success without "to" param', () => {
    const config = new Config();

    const result = config.from("test");

    // @ts-ignore
    expect(config._from[0]).toEqual({ sourcepath: "test", to: "." });
    expect(result).toEqual(config);
  });

  it('should exec success with "to" param', () => {
    const config = new Config();

    const result = config.from("test", "db");

    // @ts-ignore
    expect(config._from[0]).toEqual({ sourcepath: "test", to: "db" });
    expect(result).toEqual(config);
  });

  it("should throw error if sourcepath invalid", () => {
    const config = new Config();

    try {
      config.from(null);
      throw new Error("should throw error");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(error.code).toEqual(ConfigError.CODES.INVALID_ARGS);
    }
  });

  it("should throw error if to value invalid", () => {
    const config = new Config();

    try {
      config.from("from", null);
      throw new Error("should throw error");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(error.code).toEqual(ConfigError.CODES.INVALID_ARGS);
    }
  });
});
