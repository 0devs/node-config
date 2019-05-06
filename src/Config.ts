import ConfigError from "./Error";

import kindOf = require("./modules/kind-of");

// class methods
import set from "./methods/set";
import get from "./methods/get";
import validate from "./methods/validate";
import use = require("./methods/use");
import from from "./methods/from";
import receive = require("./methods/receive");
import getRaw from "./methods/getRaw";
import setRaw from "./methods/setRaw";
import mergeRaw from "./methods/mergeRaw";

export { ConfigError as Error };

type Logger = any;

export type Name = string | string[];
export type Value = null | any[] | string | number | object | boolean;
export type ReturnValue = Value | undefined;
export type Data = any;
export type ValidationFunction = (data: Data) => Promise<boolean>;

export interface IFromItem {
  sourcepath: string | string[];
  to: string;
}

/**
 * Config
 */
class Config {
  public Error: typeof ConfigError;
  private _logger: Logger | null;
  private _immutable: boolean;
  private _valid: boolean;
  private _validation: ValidationFunction | null;
  private _data: Data;
  private _from: IFromItem[];
  private _receivePlugins: [];
  private _validatePlugin: null;

  /**
   * @param {?Logger} logger
   */
  constructor(logger?: Logger) {
    this.Error = ConfigError;

    this._logger = this._validateLogger(logger);

    this._immutable = false;
    this._valid = false;
    this._validation = null;

    this._data = {};

    this._from = [];

    this._receivePlugins = [];
    this._validatePlugin = null;
  }

  public get __data() {
    return this._data;
  }

  public set __data(data: any) { // TODO any
    this._data = data;
  }

  public get __validation() {
    return this._validation;
  }

  public get __valid() {
    return this._valid;
  }

  public set __valid(valid: boolean) {
    this._valid = valid;
  }

  /**
   * set config immutable or mutable
   *
   * @param {Boolean} flag
   * @return {this}
   */
  public setImmutable(flag: boolean): this {
    if (typeof flag !== "boolean") {
      throw new ConfigError({
        code: ConfigError.CODES.INVALID_ARGS,
        data: {
          method: "setImmutable",
          arg: "flag",
          type: "boolean",
        },
      });
    }

    this._immutable = flag;

    return this;
  }

  /**
   * is config immutable
   *
   * @return {Boolean}
   */
  public isImmutable(): boolean {
    return this._immutable;
  }

  /**
   * set config param
   *
   * @param {String|Array} name
   * @param {Null|Array|String|Number|Object|Boolean} value
   * @return {this}
   */
  public set(name: Name, value: Value): Config {
    return set(this, name, value);
  }

  /**
   * get config param
   *
   * @param {String|Array} name
   * @param {Null|Array|String|Number|Object|Boolean} defaultValue
   * @return {Undefined|Null|Array|String|Number|Object|Boolean}
   */
  public get(name: Name, defaultValue?: Value): ReturnValue {
    return get(this, name, defaultValue);
  }

  /**
   * set raw config param
   *
   * @param {String|Array} name
   * @param {*} value
   * @return {this}
   */
  public setRaw(name: Name, value: Value): Config {
    return setRaw(this, name, value);
  }

  /**
   * get raw config param
   * returned value NOT cloned
   *
   * @param {String|Array} name
   * @param {*} defaultValue
   * @return {*}
   */
  public getRaw(name: Name, defaultValue: Value): ReturnValue {
    return getRaw(this, name, defaultValue);
  }

  /**
   * merge raw data
   *
   * @param {Object|Array} source
   * @return {this}
   */
  public mergeRaw(source: any): Config {
    return mergeRaw(this, source);
  }

  /**
   * set validation function
   *
   * @param {Function} validationFunction
   * @return {this}
   */
  public validation(validationFunction: ValidationFunction): this {
    if (kindOf(validationFunction) !== "function") {
      throw new ConfigError({
        code: ConfigError.CODES.INVALID_ARGS,
        data: {
          method: "validation",
          arg: "validationFunction",
          type: "function",
        },
      });
    }

    this._validation = validationFunction;

    return this;
  }

  /**
   * validate config
   *
   * @return {Promise}
   */
  public validate(): Promise<any> {
    return validate(this);
  }

  /**
   * is config valid
   *
   * @return {Boolean}
   */
  public isValid(): boolean {
    return this._valid;
  }

  /**
   * add plugin
   *
   * @param {Function} plugin
   * @param {Object} options
   * @return {this}
   */
  public use(plugin: () => void, options: object): this {
    use(this, plugin, options);
    return this;
  }

  /**
   * set config part sourcepath and key in config
   *
   * @param {String} sourcepath
   * @param {String|Array|Undefined} to
   * @return {this}
   */
  public from(sourcepath: string, to?: string): Config {
    return from(this, sourcepath, to);
  }

  /**
   * receive sources
   *
   * @return {this}
   */
  public receive(): Promise<this> {
    return receive(this);
  }

  /**
   * receive and validate config
   *
   * @return {Promise}
   */
  public init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._debug("init: call");

      this.receive()
        .then(() => this.validate())
        .then(() => {
          this._debug("init: done");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * clone config
   *
   * @param {String} name = '.'
   * @return {Config}
   */
  public clone(name: string = "."): Config {
    const data = this.get(name);

    const newConfig = new Config(this._logger);

    if (data) {
      newConfig.setRaw(".", data);
    }

    newConfig.setImmutable(this.isImmutable());

    return newConfig;
  }

  /**
   * internal API method
   */
  public _pushFromItem(item: IFromItem) {
    this._from.push(item);
  }

  public _debug(...args: any) {
    if (
      this._logger
            && this._logger.debug
            && typeof this._logger.debug === "function"
    ) {
      args.unshift(this._logger);
      this._logger.debug.apply(...args);
    }
  }

   public _trace(...args: any) {
    if (
      this._logger
            && this._logger.trace
            && typeof this._logger.trace === "function"
    ) {
      args.unshift(this._logger);
      this._logger.trace.apply(...args);
    }
  }

  /**
   * validate logger
   *
   * @private
   * @param {?Logger} logger
   * @return {Logger|Null}
   */
  private _validateLogger(logger: Logger | null): Logger | null {
    if (!logger) {
      return null;
    }

    if (typeof logger.debug !== "function") {
      throw new ConfigError(ConfigError.CODES.INVALID_LOGGER);
    }

    if (typeof logger.trace !== "function") {
      throw new ConfigError(ConfigError.CODES.INVALID_LOGGER);
    }

    return logger;
  }
}

export default Config;
