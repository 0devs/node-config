import deepmerge = require("deepmerge");
import _get = require("lodash.get");
import _set = require("lodash.set");

import {Logger, Source, Destination, IFrom, Validation} from "./types";

export default class Config<D extends {[index: string]: any}> {
  private _logger: Logger | null = null;
  private _data: any = {};
  private _from: IFrom[] = [];
  private _validation: Validation = null;

  constructor(logger?: Logger) {
    if (logger) {
      this._logger = logger;
    }
  }

  public config(): D {
    return this._clone(this._data);
  }

  public set(name: string, value: any) {
    _set(this._data, name, value);
  }

  public get(name: string, defaultValue?: any) {
    return this._clone(_get(this._data, name, defaultValue));
  }

  public from(source: Source, destination: Destination) {
    this._from.push({source, destination, optional: false, defaults: false});
    return this;
  }

  public fromOptional(source: Source, destination: Destination) {
    this._from.push({source, destination, optional: true, defaults: false});
    return this;
  }

  public defaults(defaults: any | Source) {
    if (typeof defaults === "function") {
      this._from.push({
        source: defaults,
        destination: ".",
        optional: false,
        defaults: true,
      });
    } else {
      this._from.push({
        source: () => Promise.resolve(defaults),
        destination: ".",
        optional: false,
        defaults: true,
      });
    }

    return this;
  }

  public defaultsOptional(defaults: any | Source) {
    if (typeof defaults === "function") {
      this._from.push({
        source: defaults,
        destination: ".",
        optional: true,
        defaults: true,
      });
    } else {
      this._from.push({
        source: () => Promise.resolve(defaults),
        destination: ".",
        optional: true,
        defaults: true,
      });
    }

    return this;
  }

  public read() {
    const promises = this._from.map(
      (from) => {
        return from.source()
          .then(source => ({...from, source}))
          .catch((error) => {
            if (from.optional) {
              this._error(error);
              return {...from, source: {}};
            }

            throw error;
          });
      }
    );

    return Promise.all(promises)
      .then((results) => {
        let data = this._data;

        // apply defaults
        Object.values(results)
          .filter(({defaults}) => defaults === true)
          .forEach(({source}) => {
            data = deepmerge(data, source);
          });

        // set values
        Object.values(results)
          .filter(({defaults}) => defaults === false)
          .forEach(({source, destination}) => {
            if (destination === ".") {
              data = deepmerge(data, source);
            } else {
              _set(data, destination, source);
            }
          });

          this._data = data;
      });
  }

  public validation(validation: Validation) {
    this._validation = validation;
  }

  public async validate() {
    if (this._validation) {
      const valid = await this._validation(this._data);
      this._data = valid;
    }
  }

  private _clone(value: any) {
    if (typeof value === "undefined") {
      return value;
    }

    return JSON.parse(JSON.stringify(value));
  }

  private _debug(...args: any) {
    if (this._logger) {
      this._logger.debug(...args);
    }
  }

  private _error(...args: any) {
    if (this._logger) {
      this._logger.error(...args);
    }
  }
}
