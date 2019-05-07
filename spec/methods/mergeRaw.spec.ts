import Config from "../../src/Config";
import ConfigError from "../../src/Error";

jest.mock("lodash.merge", () => {
  return jest.fn(() => ({merged: true}));
});

import mergeRaw from "../../src/methods/mergeRaw";

const createConfigStub = (data: any = {}) => {
  return {
    __immutable: false,
    __data: data,
    // tslint:disable-next-line
    _trace() {},
    // tslint:disable-next-line
    _debug() {},
    // tslint:disable-next-line
    setRaw: jest.fn(),
  } as any as Config;
};

describe("methods/mergeRaw", () => {
  // beforeEach()

  it("should call lodash.merge", () => {
    const config = createConfigStub({a: 1});
    const _merge = require("lodash.merge");
    mergeRaw(config, {b: 2});
    expect(_merge).toBeCalledWith({a: 1}, {b: 2});
  });

  it("should call config.setRaw", () => {
    const config = createConfigStub({a: 1});
    mergeRaw(config, {b: 2});
    expect(config.setRaw).toBeCalledWith(".", {merged: true});
  });

  it("should return config object", () => {
    const config = createConfigStub({a: 1});
    const result = mergeRaw(config, {b: 2});
    expect(result).toEqual(config);
  });

  describe("if source is object", () => {
    // tslint:disable-next-line no-identical-functions
    it("should merge without errors", () => {
      const config = createConfigStub({a: 1});
      const result = mergeRaw(config, {b: 2});
      expect(result).toEqual(config);
    });
  });

  describe("if source is array", () => {
    it("should merge without errors", () => {
      const config = createConfigStub([1]);
      const result = mergeRaw(config, [2]);
      expect(result).toEqual(config);
    });
  });

  const cases = [null, "string", 100, () => 0].map((v) => [v, typeof v]);

  describe.each(cases)("if source %s, type=%s", (source) => {
    it("should throw error", () => {
      const config = createConfigStub({});

      try {
        mergeRaw(config, source);
        throw new Error("should throw error");
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigError);
        expect(error.code).toEqual(ConfigError.CODES.INVALID_ARGS);
      }
    });
  });
});
