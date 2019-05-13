/* eslint-disable no-new */
import Config from "../src/Config";
import ConfigError from "../src/Error";

describe("Config#constructor", () => {
  it("should create without errors", () => {
    // tslint:disable-next-line
    new Config();
  });

  it("when logger with debug method passed, should create without errors", () => {
    const logger = {
      // tslint:disable-next-line
      debug() {},
      // tslint:disable-next-line
      trace() {},
    };

    // tslint:disable-next-line
    new Config(logger);
  });

  it("when logger has no debug method, should throw error", () => {
    const logger = {};
    try {
      // tslint:disable-next-line
      new Config(logger);
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(error.code).toEqual(ConfigError.CODES.INVALID_LOGGER);
    }
  });

  it("when logger has no trace method, should throw error", () => {
    const logger = {
      debug: jest.fn(),
    };

    try {
      // tslint:disable-next-line
      new Config(logger);
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(error.code).toEqual(ConfigError.CODES.INVALID_LOGGER);
    }
  });
});
