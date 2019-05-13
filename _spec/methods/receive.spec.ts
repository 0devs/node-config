// tslint:disable no-identical-functions no-duplicate-string

import Config, {IReceivePlugin} from "../../src/Config";
import ConfigError from "../../src/Error";

import receive from "../../src/methods/receive";

const createConfigStub = (data: any = {}) => {
  return {
    __from: [],
    __receivePlugins: [],
    // tslint:disable-next-line
    _trace() {},
    // tslint:disable-next-line
    _debug() {},
    // tslint:disable-next-line
    set: jest.fn(),
  } as any as Config;
};

describe("methods/receive", () => {
  it("should return promise", () => {
    const config = createConfigStub({});
    const result = receive(config);
    expect(result).toBeInstanceOf(Promise);
  });

  describe("if __from.length === 0", () => {
    it("should success", (done) => {
      const config = createConfigStub({});
      receive(config).then(done).catch(done.fail);
    });
  });

  it("should call 'isMatch' and 'read' for receive plugins", () => {
    const config = createConfigStub({});

    const isMatch1 = jest.fn(() => true);
    const read1 = jest.fn(() => Promise.resolve({}));
    const isMatch2 = jest.fn(() => false);
    const read2 = jest.fn(() => Promise.resolve({}));

    const Plugin1 = jest.fn().mockImplementation(() => {
      return {
        type: "receive",
        name: "plugin1",
        isMatch: isMatch1,
        read: read1,
      };
    });

    const Plugin2 = jest.fn().mockImplementation(() => {
      return {
        type: "receive",
        name: "plugin2",
        isMatch: isMatch2,
        read: read2,
      };
    });

    config.__receivePlugins.push(new Plugin1() as any as IReceivePlugin);
    config.__receivePlugins.push(new Plugin2() as any as IReceivePlugin);

    config.__from.push({sourcepath: "./test.json", to: "."});

    return receive(config)
      .then(() => {
        expect(isMatch1).toBeCalled();
        expect(read1).toBeCalled();
        expect(isMatch2).toBeCalled();
        expect(read2).not.toBeCalled();
      });
  });

  it("should set all data with config.set function after receive", async () => {
    const config = createConfigStub({});

    const isMatch1 = jest.fn(() => true);
    const read1 = jest.fn(() => Promise.resolve({a: 1}));

    const Plugin1 = jest.fn().mockImplementation(() => {
      return {
        type: "receive",
        name: "plugin1",
        isMatch: isMatch1,
        read: read1,
      };
    });

    config.__receivePlugins.push(new Plugin1() as any as IReceivePlugin);
    config.__from.push({sourcepath: "./test.json", to: "."});

    await receive(config);

    expect(config.set).toBeCalledWith(".", {a: 1});
  });

  it("should set data to key 'test' with config.set function after receive", async () => {
    const config = createConfigStub({});

    const isMatch1 = jest.fn(() => true);
    const read1 = jest.fn(() => Promise.resolve({a: 1}));

    const Plugin1 = jest.fn().mockImplementation(() => {
      return {
        type: "receive",
        name: "plugin1",
        isMatch: isMatch1,
        read: read1,
      };
    });

    config.__receivePlugins.push(new Plugin1() as any as IReceivePlugin);
    config.__from.push({sourcepath: "./test.json", to: "test"});

    await receive(config);

    expect(config.set).toBeCalledWith("test", {a: 1});
  });

  describe("if receive plugin not found for sourcepath", () => {
    it("should reject error", (done) => {
      const config = createConfigStub({});
      config.__from.push({sourcepath: "./test.json", to: "."});
      receive(config)
        .then(() => done.fail("should reject"))
        .catch((error) => {
          expect(error).toBeInstanceOf(ConfigError);
          expect(error.code).toEqual(Config.Error.CODES.UNKNOWN_SOURCE_TYPE);
          done();
        });
    });
  });

  describe("if receive plugin read method return not promise", () => {
    it("should reject error", (done) => {
      const config = createConfigStub({});
      const isMatch1 = jest.fn(() => true);
      const read1 = jest.fn(() => null);

      const Plugin1 = jest.fn().mockImplementation(() => {
        return {
          type: "receive",
          name: "plugin1",
          isMatch: isMatch1,
          read: read1,
        };
      });

      config.__receivePlugins.push(new Plugin1() as any as IReceivePlugin);
      config.__from.push({sourcepath: "./test.json", to: "."});

      receive(config)
        .then(() => done.fail("should reject"))
        .catch((error) => {
          expect(error).toBeInstanceOf(ConfigError);
          expect(error.code).toEqual(Config.Error.CODES.INVALID_PLUGIN_READ);
          done();
        });
    });
  });

  describe("if receive plugin fail on read", () => {
    it("should reject error", (done) => {
      const config = createConfigStub({});

      const isMatch1 = jest.fn(() => true);
      const read1 = jest.fn(() => Promise.reject(new Error("no connection")));
      const Plugin1 = jest.fn().mockImplementation(() => {
        return {
          type: "receive",
          name: "plugin1",
          isMatch: isMatch1,
          read: read1,
        };
      });

      config.__receivePlugins.push(new Plugin1() as any as IReceivePlugin);
      config.__from.push({sourcepath: "./test.json", to: "."});

      receive(config)
        .then(() => done.fail("should reject"))
        .catch((error) => {
          expect(error).toBeInstanceOf(ConfigError);
          expect(error.code).toEqual(Config.Error.CODES.FAILED_TO_READ_SOURCE);
          done();
        });
    });
  });
});
