let t = require('tap');
let proxyquire = require('proxyquire');

let root = '../../../..';

let ConfigError = require(root + '/package/Error.js');

let createConfigStub = function() {
    return {
        _from: [],
        _receivePlugins: [],
        _debug: function() {
            // console.log.apply(console, arguments);
        },

        set: function() {

        }
    };
};

t.test('#receive should return promise', function(t) {
    let config = createConfigStub();

    let receive = proxyquire(root + '/package/methods/receive', {});

    let promise = receive(config);

    t.type(promise.then, 'function');
    t.type(promise.catch, 'function');

    t.end();
});


t.test('#receive should success if _from.length === 0', function(t) {
    let config = createConfigStub();

    let receive = proxyquire(root + '/package/methods/receive', {});

    let promise = receive(config);

    return promise.then(function() {
        t.end();
    });
});

t.test('#receive should call isMatch and read for receive plugins', function(t) {
    let config = createConfigStub();

    let receive = proxyquire(root + '/package/methods/receive', {});

    let Plugin1 = function() {
        this.type = 'receive';
        this.name = 'plugin1';
    };

    let isMatchCalled = false;

    Plugin1.prototype.isMatch = function(/* sourcepath */) {
        isMatchCalled = true;
        return true;
    };

    let readCalled = false;

    Plugin1.prototype.read = function(/* sourcepath */) {
        return new Promise(function(resolve) {
            readCalled = true;
            resolve({});
        });
    };

    let Plugin2 = function() {
        this.type = 'receive';
        this.name = 'plugin2';
    };


    Plugin2.prototype.isMatch = function(/* sourcepath */) {
        return false;
    };

    Plugin2.prototype.read = function() {
        return new Promise(function(resolve) {
            resolve();
        });
    };

    config._receivePlugins.push(new Plugin2());
    config._receivePlugins.push(new Plugin1());

    config._from.push({sourcepath: './test.json', to: '.'});

    receive(config)
        .then(function() {
            t.ok(isMatchCalled, 'Plugin.isMatch not called');
            t.ok(readCalled, 'Plugin.read not called');
            t.end();
        })
        .catch(function(error) {
            t.threw(error);
        });
});


t.test('#receive should set data with config.set function after receive', function(t) {
    let config = createConfigStub();

    config.set = function(name, value) {
        t.equal(name, '.');
        t.same(value, {a: 1, b: 2});
        t.end();
    };

    let receive = proxyquire(root + '/package/methods/receive', {});

    let Plugin1 = function() {
        this.type = 'receive';
        this.name = 'plugin1';
    };

    Plugin1.prototype.isMatch = function(/* sourcepath */) {
        return true;
    };

    Plugin1.prototype.read = function(/* sourcepath */) {
        return new Promise(function(resolve) {
            resolve({a: 1, b: 2});
        });
    };

    config._receivePlugins.push(new Plugin1());

    config._from.push({sourcepath: './test.json', to: '.'});

    receive(config);
});


t.test('#receive should reject error if receive plugin not found for sourcepath', function(t) {
    let config = createConfigStub();

    config._from.push({sourcepath: './test.json', to: '.'});

    let receive = proxyquire(root + '/package/methods/receive', {});

    receive(config)
        .then(function() {
            t.threw(new Error('should reject error'));
        })
        .catch(function(error) {
            t.ok(error instanceof ConfigError);
            t.equal(error.code, ConfigError.CODES.UNKNOWN_SOURCE_TYPE);
            t.end();
        });
});


t.test('#receive should reject error, if receive plugin read method return not promise', (t) => {
    let config = createConfigStub();

    config._from.push({sourcepath: './test.json', to: '.'});

    let Plugin1 = function() {
        this.type = 'receive';
        this.name = 'plugin1';
    };

    Plugin1.prototype.isMatch = function(/* sourcepath */) {
        return true;
    };

    Plugin1.prototype.read = function(/* sourcepath */) {
        return null;
    };

    config._receivePlugins.push(new Plugin1());

    let receive = proxyquire(root + '/package/methods/receive', {});

    receive(config)
        .then(function() {
            t.threw(new Error('should reject error'));
        })
        .catch(function(error) {
            t.ok(error instanceof ConfigError);
            t.equal(error.code, ConfigError.CODES.INVALID_PLUGIN_READ);
            t.end();
        });
});


t.test('#receive should reject error, if receive plugin fail on read', function(t) {
    let config = createConfigStub();

    config._from.push({sourcepath: './test.json', to: '.'});

    let Plugin1 = function() {
        this.type = 'receive';
        this.name = 'plugin1';
    };

    Plugin1.prototype.isMatch = function(/* sourcepath */) {
        return true;
    };

    Plugin1.prototype.read = function(/* sourcepath */) {
        return new Promise(function(resolve, reject) {
            reject(new Error('no connection'));
        });
    };

    config._receivePlugins.push(new Plugin1());

    let receive = proxyquire(root + '/package/methods/receive', {});

    receive(config)
        .then(function() {
            t.threw(new Error('should reject error'));
        })
        .catch(function(error) {
            t.ok(error instanceof ConfigError);
            t.equal(error.code, ConfigError.CODES.FAILED_TO_READ_SOURCE);
            t.end();
        });
});
