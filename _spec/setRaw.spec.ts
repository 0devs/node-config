import Config from "../src/Config";

jest.mock("../src/methods/setRaw", () => {
  return {
    default: jest.fn((() => "test")),
  };
});

import setRaw from "../src/methods/setRaw";

describe("Config#setRaw", () => {
  it("should call methods/setRaw", () => {

    const config = new Config();

    const result = config.setRaw("test", "100500");

    expect(setRaw).toBeCalledWith(config, "test", "100500");
    expect(result).toEqual("test");
  });
});
