// tslint:disable no-duplicate-string
import Config from "../../src/Config";
import ConfigError from "../../src/Error";

import setRaw from "../../src/methods/setRaw";

const createConfigStub = (data: any = {}) => {
  return {
    __data: data,
    __immutable: false,
    isImmutable() { return this.__immutable; },
    // tslint:disable-next-line
    _debug() {},
  } as any as Config;
};

describe("methods/setRaw", () => {
  it("should set full config object on setRaw('.', value)", () => {
    const config = createConfigStub({});

    setRaw(config, ".", {a: 1, b: 2});

    expect(config.__data).toEqual({a: 1, b: 2});
  });

  it.each<any>([
    ["null", null],
    ["string", "string"],
    ["array", [1, 2, 3]],
    ["object", {a: 1}],
    ["boolean", true],
    ["undefined", undefined],
    ["function", () => 0],
  ])(
    "should set %s without errors",
    (type, value) => {
      const config = createConfigStub({});
      setRaw(config, ".", value);
    },
  );

  it("should return this", () => {
    const config = createConfigStub({});
    const result = setRaw(config, ".", {a: 1, b: 2});
    expect(result).toEqual(config);
  });

  it("should throw error if config immutable", (done) => {
    const config = createConfigStub({});
    // @ts-ignore
    config.__immutable = true;
    try {
      setRaw(config, ".", {a: 1, b: 2});
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
        setRaw(config, "test", "100500");

        expect(config.__data).toEqual({test: "100500"});
      });

      it("should set nested value", () => {
        const config = createConfigStub({});
        setRaw(config, "test.a", "100500");

        expect(config.__data).toEqual({test: {a: "100500"}});
      });
    });

    describe("if name is array", () => {
      it("should set value with dot in name", () => {
        const config = createConfigStub({});
        setRaw(config, ["test.name"], "100500");

        expect(config.__data).toEqual({"test.name": "100500"});
      });

      it("should set nested value", () => {
        const config = createConfigStub({});
        setRaw(config, ["test", "a"], "100500");

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
            setRaw(config, name, {});
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
