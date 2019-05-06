import Config from "../src/Config";

jest.mock("../src/methods/receive", () => jest.fn((() => "test")));

import receive = require("../src/methods/receive");

describe("Config#receive", () => {
  it("should call methods/receive", () => {

    const config = new Config();

    const result = config.receive();

    expect(receive).toBeCalledWith(config);
    expect(result).toEqual("test");
  });
});
