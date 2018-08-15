## usage planning

### base usage

```js
var Config = require('@0devs/config');
var logger = require('./Logger').getLogger();

var config = new Config(logger);

config.set('db', {host: 'localhost', port: 3306});

var port = config.get('db.port');

config.set('db.host', '10.10.10.10');

// get full config object
var configObject = config.get('.');
```

## immutable config

```js
var Config = require('@0devs/config');
var logger = require('./Logger').getLogger();

var config = new Config(logger);

config.set('db', {host: 'localhost', port: 3306});

config.setImmutable(true);

// throw ConfigError(ConfigError.CODES.IMMUTABLE)
config.set('db.host', '10.10.10.10');

config.setImmutable(false);

config.set('db.host', '10.10.10.10');

```


### config validation

```js
// for example using joi

var joi = require('joi');
var Config = require('@0devs/config');

var config = new Config();

var schema = joi.object().keys({
    db: joi.object().required().keys({
        host: joi.string().required(),
        port: joi.number().integer().positive().default(3306)
    })
});

config.validation(function (raw) {

    return new Promise((resolve, reject) => {

        joi.validate(raw, schema, {convert: true}, function (error, validConfigData) {

            if (error) {
                return reject(error);
            }

            resolve(validConfigData);

        });
    });

});

config.init()
    .then(() => {
        var port = config.get('db.port');
    })
    .catch((error) => {
        logger.error(error);
    });

```


### json, js config file, all config in one file

js file exports object

all config in one file

```js

var Config = require('@0devs/config');

var config = new Config();

config.use(require('@0devs/config/from/json'), {options: 'here'});

config
    .from('/etc/config.json')
    // add config validation if need
    .validation(function (raw) {});

config.init()
    .then(function () {
        // ...
    });

```

### json, js config file, config parts in separate files


#### /etc/config.json
```json
{
    "logLevel": "DEBUG"
}
```

#### /etc/mysqlDb.json

```json
{
    "host": "localhost",
    "port": "3306"
}
```

#### /etc/rest-api.json

```json
{
    "github": "https://api.github.com"
}
```

#### init config

```js
var Config = require('@0devs/config');

var config = new Config();

config.use(require('@0devs/config/from/json'), {options: 'here'});

config
    .from('/etc/config.json')
    .from('/etc/mysqlDb.json', 'mysqlDb')
    .from('/etc/rest-api.json', 'restApi');

config.init()
    .then(() => {
        console.log(config.get('.'));

        // output
        {
            logLevel: 'DEBUG',

            // key set from name of file
            mysqlDb: {
                host: 'localost',
                port: 3306
            },

            restApi: {
                github: 'https://api.github.com'
            }
        }
    })

```


## plugin creation

for example

### plugin `@0devs/config-yml`

```js

var fs = require('fs');
var yaml = require('js-yaml');

function YamlPlugin (logger) {

    this.type = 'receive';

    this._logger = logger;

    this._options = {
        fileRegex: /\.yml$/
    };

}


YamlPlugin.prototype.init = function (options) {

    return new Promise((resolve, reject) => {

        if (options && options.fileRegex) {

            if (options.fileRegex instanceof RegExp) {
                this._options.fileRegex = options.fileRegex;
            } else {
                return reject(
                    new Error(
                        '@0devs/config-yml: options.fileRegex should be RegExp'
                    )
                );
            }

        }

        resolve();
    });

};


YamlPlugin.prototype.isMatch = function (filepath) {

    return new Promise((resolve, reject) => {

        var isYaml = /\.yml$/.test(filepath);

        resolve(isYaml);

    });

};


YamlPlugin.prototype.exists = function (filepath) {

    return new Promise((resolve, reject) => {
        resolve(fs.existsSync(filepath));
    });

};


YamlPlugin.prototype.read = function (filepath) {

    return new Promise((resolve, reject) => {
        try {

            var raw = yaml.safeLoad(
                fs.readFileSync(filepath, 'utf8')
            );

            resolve(raw);

        } catch (error) {
            reject(error);
        }
    });

};

```

### mixed sources usage

```js
var Config = require('@0devs/config');

var config = new Config();

config
    .use(require('@0devs/config-from-yml'))
    .use(require('@0devs/config-from-json'))
    .use(require('@0devs/config-from-http'))
    .from({
        '.': '/etc/test.config.yml',
        'db':  '/etc/db.json',
        'api': '/etc/api.json'
    })
    .from('/etc/test.config.yml', '.')
    .from('/etc/db.json', 'db')
    .from('/etc/api.json', 'api')
    .init()
    .then(() => {
        console.log(config.get('some.param'));
    });


// OR using consul kv

config
    .use(require('@0devs/config-consul'))
    .from(`consul = services/tasks, services/tasks:${os.hostname()}`)
    .init()
    .then()


// OR using mixed sources

config
    .use(require('@0devs/config-consul'))
    .use(require('@0devs/config-yml'))
    .from(`consul = services/tasks, services/tasks:${os.hostname()}`)
    .from('/etc/db.yml', 'db')
    .init()
    .then()

```
