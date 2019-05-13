import Config from "../src/Config";

describe("Config:isValid", () => {
  it("should return valid state", () => {
    const config = new Config();

    expect(config.isValid()).toEqual(false);

    return config.validate()
      .then(() => {
        expect(config.isValid()).toEqual(true);
      });
  });
});
