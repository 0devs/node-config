# develpoment plan

HERE IS FEATURE PLAN, this features not available

# core

## add method for get some multi params from config

```js
// this is internal config structure
{
    app: {
        host: 'localhost'
    },
    some: {
        api: {
            port: 100500
        }
    }
}

// just raw method name `getMany`
var obj = config.getMany({
    host: 'db.host',
    port: 'some.api.port'
});

// obj =
{
    host: 'localhost',
    port: 100500
}
```

## new `use` method signature

create plugin before call use method

```ts
const config = new Config();

const plugin = new Plugin();

// OR just object
const plugin1 = {
  type: "receive",
  read: () => {return {a: 1, b: 2}},
};

config.use(plugin);
config.use(plugin1);

```

or may be new `from` method signuture

```ts
// not plugin, but source

// init plugins
const json = new JsonPlugin();
const consul = new ConsulPlugin();
const vault = new VaultPlugin();

config
  .from(json("/etc/cfg.json"), "cfg")
  .from(consul("db"), "db")
  .from(vault("db/password"), "db.password")
  .replaceFrom(env({
    HOST: "cfg.host",
    PORT: "cfg.port",
  }));

```


## config types

```ts
interface IConfig {
  server: {
    host: string;
    port: number;
  }
}

const config = new Config<IConfig>();

const host = config.get(["server", "host"]); // string
const port = config.get("server.port"); // number
```

## env receive plugin

```js
config
  .use(require("@0devs/config-from-env"), {prefix: "CONFIG_", insensitive: true})
  .from("env:host", "host") // process.env.CONFIG_HOST or env.config_host
  .from("env:port", "port") // process.env.CONFIG_PORT or env.config_port

  // OR map in options
  config.use(
    require("@0devs/config-from-env"),
    {
      prefix: "CONFIG_",
      insensitive: true,
      schema: {
        host: "host",
        port: "port",
      },
    }
  );
```

## consul receive plugin

```js
config
  .use(require("@0devs/config-from-consul"), {host: "", port: ""})
  .from([ // first available key value will be used as config
    "consul://services/dev_test",
    "consul://services/dev_test_host1",
    "consul://services/dev_test_host1_1",
  ])

```

## vault receive plugin

```ts
config
  .use(require("@0devs/config-from-vault"), {host: "", port: "", token: ""})
  .from([])
```

## watch method

For example, you get config from consul

update value in consul web ui

plugin watches consul kv with [`consul.watch`](https://github.com/silas/node-consul#watch)

config or config part dynamically updates and `watch` called

```js
var config = new Config();

config
    .use(require('@0devs/config-consul'))
    .use(require('@0devs/config-yaml'))
    .from('/etc/config.yml')
    .part('consul = services/tasks', 'api.tasks')
    .watch('api.tasks', function () {
        // api.tasks changed
        // reload app
    })
```
