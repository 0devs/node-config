import Config from "../src/Config";


describe("Config", () => {
  it("should create without errors", () => {
    new Config();
  });
});

describe("#defaults", () => {
  it("should set defaults from object", async () => {
    const config = new Config();
    config.defaults({a: 1});
    await config.read();
    expect(config.config()).toEqual({a: 1});
  });

  it("should set defaults from function", async () => {
    const config = new Config();
    config.defaults(() => Promise.resolve({a: 1}));
    await config.read();
    expect(config.config()).toEqual({a: 1});
  });

  it("should deep merge defaults with from values", async () => {
    const config = new Config();
    config.defaults({a: {b: 1, c: 3}, d: 4});
    config.from(() => Promise.resolve({a: {b: 2, f: 6}, e: 5}), ".");
    await config.read();
    expect(config.config()).toEqual({a: {b: 2, c: 3, f: 6}, d: 4, e: 5});
  });

  it("should throw error if read failed", async (done) => {
    const config = new Config();
    config.defaults(() => Promise.reject(new Error("test")));

    try {
      await config.read();
      done.fail("should reject");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual("test");
      done();
    }
  });
});

describe("#defaultsOptional", () => {
  it("should set defaults from object", async () => {
    const config = new Config();
    config.defaultsOptional({a: 1});
    await config.read();
    expect(config.config()).toEqual({a: 1});
  });

  it("should set defaults from function", async () => {
    const config = new Config();
    config.defaultsOptional(() => Promise.resolve({a: 1}));
    await config.read();
    expect(config.config()).toEqual({a: 1});
  });

  it("should deep merge defaults with from values", async () => {
    const config = new Config();
    config.defaultsOptional({a: {b: 1, c: 3}, d: 4});
    config.from(() => Promise.resolve({a: {b: 2, f: 6}, e: 5}), ".");
    await config.read();
    expect(config.config()).toEqual({a: {b: 2, c: 3, f: 6}, d: 4, e: 5});
  });

  it("should not throw error if read failed", async () => {
    const config = new Config();
    config.defaultsOptional(() => Promise.reject(new Error("test")));
    await config.read();
    expect(config.config()).toEqual({});
  });
});


describe("#from", () => {
  it("should set all config if destination = '.'", async () => {
    const config = new Config();
    config.from(() => Promise.resolve({a: 1}), ".");
    await config.read();
    expect(config.config()).toEqual({a: 1});
  })

  it ("should set key value if destinaion is keypath", async () => {
    const config = new Config();
    config.from(() => Promise.resolve({a: 1}), "test.y");
    await config.read();
    expect(config.config()).toEqual({test: {y: {a: 1}}});
  });

  it("should throw error if read failed", async (done) => {
    const config = new Config();
    config.from(() => Promise.reject(new Error("test")), ".");

    try {
      await config.read();
      done.fail("should reject");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual("test");
      done();
    }
  });
});

describe("#fromOptional", () => {
  it("should set all config if destination = '.'", async () => {
    const config = new Config();
    config.fromOptional(() => Promise.resolve({a: 1}), ".");
    await config.read();
    expect(config.config()).toEqual({a: 1});
  })

  it ("should set key value if destinaion is keypath", async () => {
    const config = new Config();
    config.fromOptional(() => Promise.resolve({a: 1}), "test.y");
    await config.read();
    expect(config.config()).toEqual({test: {y: {a: 1}}});
  });

  it("should not throw error if read failed", async () => {
    const config = new Config();
    config.fromOptional(() => Promise.reject(new Error("test")), ".");
    await config.read();
    expect(config.config()).toEqual({});
  });
});


describe("#set", () => {
  it("should set key value", () => {
    const config = new Config();
    config.set("a", {b: 1});
    expect(config.config()).toEqual({a: {b: 1}});
  });
});

describe("#get", () => {
  it("should get key value", () => {
    const config = new Config();
    config.set("a", {b: 1});
    expect(config.get("a.b")).toEqual(1);
  });

  it("should return undefined if key not exists", () => {
    const config = new Config();
    expect(config.get("a.b")).toBeUndefined();
  });

  it("should return defaultValue if passed", () => {
    const config = new Config();
    expect(config.get("a.b", 2)).toEqual(2);
  });
});


describe("#read", () => {
  it("should read from and defaults", async () => {
    const config = new Config();

    config
      .defaults({server: {host: null, port: 80}})
      .from(() => Promise.resolve({server: {host: "1", port: 8080}}), ".")
      .from(() => Promise.resolve(9090), "server.port");

    await config.read();

    expect(config.config()).toEqual({server: {host: "1", port: 9090}});
  });
});

describe("#validate", () => {
  it("should call validation function and set valid config", async () => {
    const config = new Config();
    config.validation(() => Promise.resolve({a: 1}));

    await config.validate();

    expect(config.config()).toEqual({a: 1});
  });
});
