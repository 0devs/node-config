# @0devs/config

extendable config for node and browser

# install

```
npm install --save @0devs/config
```

# usage

```ts
import Config from "@0devs/config";

const config = new Config();

config
  .defaults({server: {host: null, port: 80}})
  .from(() => Promise.resolve({server: {host: "127.0.0.1", port: 8080}}), ".")
  .from(() => Promise.resolve(9090), "server.port");

await config.read();

config.get("server.port"); // => 9090
config.config(); // {server: {host: "127.0.0.1", port: 9090}}
```

# LICENSE

MIT
