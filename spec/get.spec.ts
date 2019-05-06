import Config from "../src/Config";

jest.mock("../src/methods/get", () => {
  return {
    default: jest.fn((() => "get-result")),
  };
});

import get from "../src/methods/get";

describe("Config#get", () => {
  it("should call get method function", () => {
    const config = new Config();

    config.get("100", 500);

    expect(get).toBeCalledWith(config, "100", 500);
  });

  it("should return result of get method", () => {
    const config = new Config();

    const result = config.get("100", 500);

    expect(result).toEqual("get-result");
  });
});
