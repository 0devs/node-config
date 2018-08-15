# @0devs/config

extendable config

# install

```
npm install --save @0devs/config
```

# usage

this package can be used with node.js or in browser

by default config can't receive any config types, use [plugins](#plugins)

here example of node.js usage, reading json configs

```js
var Config = require('@0devs/config');

var config = new Config();

config
    .use(require('@0devs/config-from-json'))
    .from('/etc/config/base.json')
    .from('/etc/config/mysql.json', 'db.mysql')
    .from('/etc/config/mongo.json', 'db.mongo')
    .from('/etc/config/api.json', 'api')
    .init()
    .then(() => {
        config.setImmutable(true);

        var fullConfigObject = config.get('.');

        // fullConfigObject =
        {
            // host and port from base.json
            host: 'localhost',
            port: 80,

            db: {
                mysql: {
                    // from mysql.json
                },
                mongo: {
                    // from mongo.json
                }
            },
            api: {
                // from api.json
            }
        }
    })
    .catch((error) => {
        // log error
    });
```

for more details (plugins, validation) - see [examples](https://github.com/mafjs/config/tree/master/examples)

# plugins

[@0devs/config-from-json](https://github.com/0devs/node-config-from-json) - read json configs

# API

see [docs/api.md](docs/api.md)

# LICENSE

MIT
