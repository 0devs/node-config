import Config from "../src/Config";

jest.mock("../src/methods/use", () => jest.fn());

import use = require("../src/methods/use");

describe("Config#use", () => {
  it("should call methods/use", () => {

    const config = new Config();

    const result = config.use({ plugin: true }, { options: true });

    expect(use).toBeCalledWith(config, { plugin: true }, { options: true });
    expect(result).toEqual(config);
  });
});
