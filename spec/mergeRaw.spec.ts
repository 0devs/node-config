import Config from "../src/Config";

jest.mock("../src/methods/mergeRaw", () => {
  return {
    default: jest.fn(),
  };
});

import mergeRaw from "../src/methods/mergeRaw";

describe("Config#mergeRaw", () => {
  it("should call methods/mergeRaw", () => {
    const config = new Config();
    const data = {
      some: "data",
    };

    config.mergeRaw(data);

    expect(mergeRaw).toBeCalledWith(config, data);
  });
});
