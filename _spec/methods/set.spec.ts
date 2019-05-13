// tslint:disable no-duplicate-string
import Config from "../../src/Config";
import ConfigError from "../../src/Error";

import set from "../../src/methods/set";

const createConfigStub = (data: any = {}) => {
  return {
    __data: data,
    __immutable: false,
    isImmutable() { return this.__immutable; },
    // tslint:disable-next-line
    _debug() {},
  } as any as Config;
};

describe("methods/set", () => {
  it("should set full config object on set('.', value)", () => {
    const config = createConfigStub({});

    set(config, ".", {a: 1, b: 2});

    expect(config.__data).toEqual({a: 1, b: 2});
  });

  it.each<any>([
    ["null", null],
    ["string", "string"],
    ["array", [1, 2, 3]],
    ["object", {a: 1}],
    ["boolean", true],
  ])(
    "should set %s without errors",
    (type, value) => {
      const config = createConfigStub({});
      set(config, ".", value);
    },
  );

  it("should return this", () => {
    const config = createConfigStub({});
    const result = set(config, ".", {a: 1, b: 2});
    expect(result).toEqual(config);
  });

  it("should throw error if config immutable", (done) => {
    const config = createConfigStub({});
    // @ts-ignore
    config.__immutable = true;
    try {
      set(config, ".", {a: 1, b: 2});
      done.fail("should throw error");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(error.code).toEqual(ConfigError.CODES.IMMUTABLE);
      done();
    }
  });

  describe("name argument", () => {

    describe("if name is string", () => {
      it("should set value", () => {
        const config = createConfigStub({});
        set(config, "test", "100500");

        expect(config.__data).toEqual({test: "100500"});
      });

      it("should set nested value", () => {
        const config = createConfigStub({});
        set(config, "test.a", "100500");

        expect(config.__data).toEqual({test: {a: "100500"}});
      });
    });

    describe("if name is array", () => {
      it("should set value with dot in name", () => {
        const config = createConfigStub({});
        set(config, ["test.name"], "100500");

        expect(config.__data).toEqual({"test.name": "100500"});
      });

      it("should set nested value", () => {
        const config = createConfigStub({});
        set(config, ["test", "a"], "100500");

        expect(config.__data).toEqual({test: {a: "100500"}});
      });
    });

    describe("if name is ", () => {
      const cases = [
        [null],
        [100500],
        [undefined],
        [{a: 1}],
        [() => 0],
      ];

      it.each<any>(cases)("%s, should throw error", (name) => {
          const config = createConfigStub();
          try {
            set(config, name, {});
            throw new Error("should throw error");
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigError);
            expect(error.code).toEqual(ConfigError.CODES.INVALID_ARGS);
          }
        },
      );
    });
  });

  describe("value argument", () => {
    describe("if value is ", () => {
      const cases = [
        [undefined],
        [() => 0],
      ];

      it.each<any>(cases)("%s, should throw error", (value) => {
          const config = createConfigStub();
          try {
            set(config, "test", value);
            throw new Error("should throw error");
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigError);
            expect(error.code).toEqual(ConfigError.CODES.INVALID_ARGS);
          }
        },
      );
    });
  });
});
