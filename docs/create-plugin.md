# Create @0devs/config Plugin

## plugin types

- [`receive`](#receive-plugin-type) - get config data from anywhere
- [`validate`](#validate-plugin-type) - validate with your favorite validator


## `receive` plugin type

plugin class should implement interface

### `type = 'receive'`

Instance property. String


### `name`

String. Required

uniq name of plugin, name from package.json


### `constructor ([logger])`

- `logger` - Logger. Optional. if passed, should have debug method



### `init (options)`

- `options` - Object. options object from `use` method (`config.use(plugin, options)`)

return `Promise`



### `isMatch (sourcepath)`

check that sourcepath processed by plugin

- `sourcepath` - String. path to config

return `Promise`

Promise should resolve `Boolean`


### `read (sourcepath)`

read config

- `sourcepath` - String. path to config

return `Promise`

in this method your can read and parse config

Promise should resolve config object


## `validate` plugin type

TODO
