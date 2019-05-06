import Config from "../src/Config";
import ConfigError from "../src/Error";

describe("Config#validation", () => {
  it("should set validation function without errors", () => {
    const config = new Config();

    config.validation(() => Promise.resolve(true));
  });

  it("should throw error if validation function is not a function", () => {
    const config = new Config();

    try {
      // @ts-ignore
      config.validation("string");
      throw new Error("should throw error");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(error.code).toEqual(ConfigError.CODES.INVALID_ARGS);
    }
  });
});
