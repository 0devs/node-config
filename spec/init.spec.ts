/* eslint-disable global-require */
import Config from "../src/Config";

jest.mock("../src/methods/receive", () => jest.fn());
jest.mock("../src/methods/validate", () => {
  return {
    default: jest.fn(),
  };
});

import receive = require("../src/methods/receive");
import validate from "../src/methods/validate";

describe("Config#init", () => {
  beforeEach(() => {
    // @ts-ignore
    receive.mockResolvedValue("received");
    // @ts-ignore
    validate.mockResolvedValue("validated");
  });

  it("should call receive and validate methods", () => {
    const config = new Config();

    return config.init()
      .then(() => {
        expect(receive).toBeCalled();
        expect(validate).toBeCalled();
      });
  });

  it("should reject if receive rejected", (done) => {
    // @ts-ignore
    receive.mockRejectedValue(new Error("receive failed"));

    const config = new Config();

    config.init()
      .then(() => {
        done(new Error("should throw error"));
      })
      .catch((error) => {
        expect(error.message).toEqual("receive failed");
        done();
      });
  });

  it("should reject if validate rejected", (done) => {
    // @ts-ignore
    validate.mockRejectedValue(new Error("validate failed"));

    const config = new Config();

    config.init()
      .then(() => {
        done(new Error("should throw error"));
      })
      .catch((error) => {
        expect(error.message).toEqual("validate failed");
        done();
      });
  });
});
