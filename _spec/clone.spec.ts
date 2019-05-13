import Config from "../src/Config";

describe("Config#clone", () => {
  it("should clone full config", () => {
    const config = new Config();

    const data = {
      test: 100500,
    };

    config.set(".", data);

    const newConfig = config.clone();

    expect(newConfig.get(".")).toEqual(data);

    const newConfig2 = newConfig.clone();

    expect(newConfig2.get(".")).toEqual(data);
  });

  it("should clone config partly", () => {
    const config = new Config();

    const data = {
      server: {
        host: null,
        port: 8080,
      },
      rest: {
        endpoint: "/api/v0",
      },
    };

    config.set(".", data);

    const serverConfig = config.clone("server");
    const restConfig = config.clone("rest");

    expect(serverConfig.get(".")).toEqual(data.server);
    expect(restConfig.get(".")).toEqual(data.rest);
  });

  it("should transfer immutable flag to cloned config", () => {
    const config = new Config();

    config.set(".", {
      test: 100500,
    });

    config.setImmutable(true);

    expect(config.isImmutable()).toEqual(true);

    const newConfig = config.clone();

    expect(newConfig.isImmutable()).toEqual(true);
  });
});
