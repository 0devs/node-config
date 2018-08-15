# develpoment plan

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
