import Config from "../src/Config";
import ConfigError from "../src/Error";

describe("Config#Error", () => {
  it("Config hash static Error property", () => {
    expect(Config.Error).toEqual(ConfigError);
  });

  it("created object should has Error property instanceof ConfigError", () => {
    const config = new Config();

    expect(config.Error).toEqual(ConfigError);
  });
});
