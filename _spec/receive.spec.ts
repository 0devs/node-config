import Config from "../src/Config";

jest.mock("../src/methods/receive", () => {
  return {
    default: jest.fn((() => "test")),
  };
});

import receive from "../src/methods/receive";

describe("Config#receive", () => {
  it("should call methods/receive", () => {

    const config = new Config();

    const result = config.receive();

    expect(receive).toBeCalledWith(config);
    expect(result).toEqual("test");
  });
});
