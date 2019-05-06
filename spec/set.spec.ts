import Config from "../src/Config";

jest.mock("../src/methods/set", () => {
  return {
    default: jest.fn((() => "test")),
  };
});

import set from "../src/methods/set";

describe("Config#set", () => {
  it("should call methods/set", () => {
    const config = new Config();

    const result = config.set("test", "100500");

    expect(set).toBeCalledWith(config, "test", "100500");
    expect(result).toEqual("test");
  });
});
