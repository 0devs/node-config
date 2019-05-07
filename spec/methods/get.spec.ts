import Config from "../../src/Config";
import ConfigError from "../../src/Error";

import get from "../../src/methods/get";

const createConfigStub = (data: any = {}) => {
  return {
    __immutable: false,
    __data: data,
    // tslint:disable-next-line
    _debug() {},
  } as any as Config;
};

describe("methods#get", () => {
  it("should return full config object on get('.')", () => {
    const config = createConfigStub();

    config.__data = {
      a: 1,
      b: 2,
    };

    const value = get(config, ".");

    expect(value).toEqual({
      a: 1,
      b: 2,
    });
  });

  describe("if no data param in config and no defaultValue", () => {
    it("should return undefined ", () => {
      const config = createConfigStub();

      const value = get(config, "test");

      expect(value).toBeUndefined();
    });
  });

  describe("if config has data param", () => {
    it("should return param value", () => {
      const config = createConfigStub();

      config.__data = {
        test: 100500,
      };

      const value = get(config, "test");

      expect(value).toEqual(100500);
    });
  });

  it("should deep clone returned value", () => {
    const config = createConfigStub();

    config.__data = {
      test: {
          a: 1,
          b: {
              c: 2,
          },
      },
    };

    const value = get(config, "test");

    value.d = 3;
    value.b.c = 100500;
    value.b.f = 2000;

    expect(config.__data).toEqual({
      test: {
          a: 1,
          b: {
              c: 2,
          },
      },
    });

    expect(value).toEqual({
        a: 1,
        b: {
            c: 100500,
            f: 2000,
        },
        d: 3,
    });
  });

  describe("name argument", () => {

    describe("if name is string", () => {
      it("should get value", () => {
        const config = createConfigStub({test: "100500"});
        const value = get(config, "test");

        expect(value).toEqual("100500");
      });

      it("should get nested value", () => {
        const config = createConfigStub({test: {a: "100500"}});
        const value = get(config, "test.a");

        expect(value).toEqual("100500");
      });
    });

    describe("if name is array", () => {
      it("should get value with dot in name", () => {
        const config = createConfigStub({"test.name": "100500"});
        const value = get(config, ["test.name"]);

        expect(value).toEqual("100500");
      });

      it("should get nested value", () => {
        const config = createConfigStub({test: {a: "100500"}});
        const value = get(config, ["test", "a"]);

        expect(value).toEqual("100500");
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
            get(config, name);
            throw new Error("should throw error");
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigError);
            expect(error.code).toEqual(ConfigError.CODES.INVALID_ARGS);
          }
        },
      );
    });
  });

  describe("defaultValue argument", () => {
    describe("if no data param and defaultValue undefined", () => {
      it("should return undefined", () => {
        const config = createConfigStub({});
        const value = get(config, "test");

        expect(value).toEqual(undefined);
      });
    });

    describe("if no param in config and defaultValue defined", () => {
      it("should return defaultValue", () => {
        const config = createConfigStub({});
        const value = get(config, "test", 100500);

        expect(value).toEqual(100500);
      });
    });

    describe("if default value valid", () => {
      const cases = [
        undefined, null, [1, 2, 3], "string", 100500, {a: 1}, true,
      ].map((v) => [v]);

      it.each<any>(cases)("%s, should return defaultValue", (defaultValue) => {
        const config = createConfigStub({});
        const value = get(config, "test", defaultValue);

        expect(value).toEqual(defaultValue);
      });
    });

    describe("if default value invalid", () => {
      const cases = [
        () => 0,
      ].map((v) => [v]);

      it.each<any>(cases)("%s, should throw error", (defaultValue) => {
        const config = createConfigStub();
        try {
          get(config, "test", defaultValue);
          throw new Error("should throw error");
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigError);
          expect(error.code).toEqual(ConfigError.CODES.INVALID_ARGS);
        }
      });
    });
  });
});
