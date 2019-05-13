// tslint:disable no-duplicate-string
import Config from "../../src/Config";
import {IReceivePluginClass} from "../../src/types";
import ConfigError from "../../src/Error";

import * as use from "../../src/methods/use";

const createConfigStub = (data: any = {}) => {
  return {
    __data: data,
    __receivePlugins: [],
    __validatePlugin: null,
    // tslint:disable-next-line
    _debug() {},
  } as any as Config;
};

describe("methods/use", () => {
  it("should throw error if plugin is not constructor", (done) => {
    const config = createConfigStub({});

    try {
      // @ts-ignore
      use(config, {}, {});
      done.fail("should throw error");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(error.code).toEqual(ConfigError.CODES.INVALID_PLUGIN);
      done();
    }
  });

  describe("receive plugins", () => {
    it("should add plugin without errors", () => {
      const Plugin = function() {
          this.type = "receive";
          this.name = "test";
      };

      Plugin.prototype.init = jest.fn();
      Plugin.prototype.isMatch = jest.fn();
      Plugin.prototype.read = jest.fn();

      const config = createConfigStub({});

      const result = use(config, Plugin as any as IReceivePluginClass, {});

      expect(result).toEqual(config);
      expect(config.__receivePlugins).toHaveLength(1);
    });

    it("should pass options to init plugin method", () => {
      const Plugin = function() {
          this.type = "receive";
          this.name = "test";
      };

      Plugin.prototype.init = jest.fn();
      Plugin.prototype.isMatch = jest.fn();
      Plugin.prototype.read = jest.fn();

      const config = createConfigStub({});

      use(config, Plugin as any as IReceivePluginClass, {a: 1, b: 2});

      expect(Plugin.prototype.init).toBeCalledWith({a: 1, b: 2});
    });
  });

});
