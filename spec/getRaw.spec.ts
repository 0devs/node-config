import Config from "../src/Config";

jest.mock("../src/methods/getRaw", () => {
  return {
    default: jest.fn((() => "get-raw-result")),
  };
});

import getRaw from "../src/methods/getRaw";

describe("Config#get", () => {
  it("should call get method function", () => {
    const config = new Config();

    config.getRaw("100", 500);

    expect(getRaw).toBeCalledWith(config, "100", 500);
  });

  it("should return result of get method", () => {
    const config = new Config();

    const result = config.getRaw("100", 500);

    expect(result).toEqual("get-raw-result");
  });
});
