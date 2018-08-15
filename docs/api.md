# @0devs/config 1.x API

- [Config](#config)
    - [`constructor ([logger])`](#constructor-logger)
    - [`setImmutable (flag)`](#setimmutable-flag)
    - [`isImmutable ()`](#isimmutable-)
    - [`set (name, value)`](#set-name-value)
    - [`get (name, [defaultValue = undefined])`](#get-name-defaultvalue--undefined)
    - [`setRaw (name, value)`](#setraw-name-value)
    - [`getRaw (name, [defaultValue = undefined])`](#getraw-name-defaultvalue--undefined)
    - [`mergeRaw (source)`](#mergeraw-source)
    - [`isValid ()`](#isvalid-)
    - [`validation (validationFunction)`](#validation-validationfunction)
    - [`validate ()`](#validate-)
    - [`receive ()`](#receive-)
    - [`init ()`](#init-)
    - [`use (plugin, [options])`](#use-plugin-options)
    - [`from (sourcepath, [to = '.'])`](#from-sourcepath-to)
    - [`clone ([name])`](#clone-name)
- [ConfigError](#configerror)
    - [error codes](#error-codes)

## Config



### `constructor ([logger])`

- `logger` - Logger. optional. if passed, should have debug and trace methods



### `setImmutable (flag)`

set config immutable or allow changes

by default config **muttable** - changes allowed

- `flag` - Boolean. true - config immutable, false - not

return `this`



### `isImmutable ()`

is config immutable

return `Boolean`



### `set (name, value)`

set config param

- `name` - String. dot-delimeted path to param (see lodash.set)
- `value` - Null|String|Number|Array|Object|Boolean

return `this`

use `config.set('.', value)` if need to set all config object

throws `ConfigError code = IMMUTABLE`, if config set immutable

throws `ConfigError code = INVALID_ARGS` if some args in function invalid

if you need dots in param names - set name param as Array, here [example](https://github.com/lodash/lodash/issues/1637#issuecomment-156258271)



### `get (name, [defaultValue = undefined])`

get config param

- `name` - String. dot-delimeted path to param (see lodash.get)
- `defaultValue = undefined` - Null|String|Number|Array|Object

return param value or defaultValue if not exists

returned value deep cloned, if object or array

use `config.get('.')` if need to get all config object

throws `ConfigError code = INVALID_ARGS` if some args in function invalid

if you need dots in param names - set name param as Array, here [example](https://github.com/lodash/lodash/issues/1637#issuecomment-156258271)


### `setRaw (name, value)`

set raw config value

since `0.2.0`

raw value set as is

- `name` - String. dot-delimeted path to param (see lodash.set)
- `value` - *

return `this`

use `config.setRaw('.', value)` if need to set all config object

throws `ConfigError code = IMMUTABLE`, if config set immutable

throws `ConfigError code = INVALID_ARGS` if some args in function invalid

if you need dots in param names - set name param as Array, here [example](https://github.com/lodash/lodash/issues/1637#issuecomment-156258271)


### `getRaw (name, [defaultValue = undefined])`

get raw config param

since `0.2.0`

- `name` - String. dot-delimeted path to param (see lodash.get)
- `defaultValue = undefined` - *

return raw param value or defaultValue if not exists

returned value NOT cloned. You got link to object, if getRaw object

use `config.getRaw('.')` if need to get all config object

throws `ConfigError code = INVALID_ARGS` if some args in function invalid

if you need dots in param names - set name param as Array, here [example](https://github.com/lodash/lodash/issues/1637#issuecomment-156258271)


### `mergeRaw (source)`

since `0.3.0`

merge config with new data object

- `source` - Object|Array.

return `this`

throws `ConfigError code = INVALID_ARGS` if some args in function invalid


### `validation (validationFunction)`

set validation function

- `validationFunction` - Function. get raw config param and should return Promise

in `validationFunction` config can be modified, convert param types or etc.

throws `ConfigError code = INVALID_ARGS` if validationFunction is not a function

return `this`

**Example**

```js
config.validation(function (raw) {

    return new Promise(function (resolve, reject) {
        // validate and convert config param

        var valid = validateAndConvert(raw);

        resolve(valid);
    });

})
```


### `validate ()`

call validationFunction and apply config

return `Promise`

throws `ConfigError, code = INVALID_DATA` if raw config data invalid

throws `ConfigError, code = INVALID_VALIDATION_FUNCTION` if validation function return not Promise


### `isValid ()`

is config valid

return `Boolean`


### `receive ()`

get config from sources

return `Promise`



### `init ()`

receive and validate config in function call

return `Promise`

throws `ConfigError, code = INVALID_DATA` if raw config data invalid



### `use (plugin, [options])`

add config plugin

- `plugin`. Object. see [Create Plugin article](create-plugin.md) for plugin creation details
- `options`. Object. Optional. Plugin settings


return `this`



### `from (sourcepath, [to='.'])`

set path to config source

- `sourcepath` - String|Object. Path to config file, filetype processing in config plugins see `use` method
- `to = '.'` - String. Optional. Default = `.`. Param name in config for setting data of source

no any config source types supported by default, use `use` method and add config plugin for your source type

return `this`



### `clone ([name])`

clone config fully or partly by sourcepath

- `name` - String. dot-delimeted path to param (see lodash.get), if clone full config - name may be omitted

if parent config immutable, cloned config will be immutable too

in new config has no validation from parent config

return `Config instance`


## ConfigError

### error codes

- INVALID_LOGGER - logger without debug method passed in constructor
- INVALID_VALIDATION_FUNCTION - validation function should return Promise
- INVALID_ARGS - invalid args passed to method, see error.message for details
- INVALID_DATA   - validation fails
- INVALID_PLUGIN - plugin has invalid interface
- INVALID_PLUGIN_TYPE - unknown plugin type
- INVALID_PLUGIN_READ - plugin read method should return Promise
- IMMUTABLE - throw if try to modify immutable config
- UNKNOWN_SOURCE_TYPE - no plugin for sourcepath
- FAILED_TO_READ_SOURCE - error when reading sourcepath
