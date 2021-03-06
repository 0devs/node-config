import {
  Logger, Source, Destination, IFrom, Validation,
} from './types';

import deepmerge = require('deepmerge');
import _get = require('lodash.get');
import _set = require('lodash.set');

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

  public set(name: string, value: any): void {
    if (name === '.') {
      throw new Error("name '.' not allowed");
    }

    _set(this._data, name, value);
  }

  public setData(value: any): void {
    this._data = this._clone(value);
  }

  public get(name: string, defaultValue?: any): any {
    return this._clone(_get(this._data, name, defaultValue));
  }

  public from(source: Source, destination: Destination): this {
    this._from.push({
      source, destination, optional: false, defaults: false,
    });
    return this;
  }

  public fromOptional(source: Source, destination: Destination): this {
    this._from.push({
      source, destination, optional: true, defaults: false,
    });
    return this;
  }

  public defaults(defaults: any | Source): this {
    if (typeof defaults === 'function') {
      this._from.push({
        source: defaults,
        destination: '.',
        optional: false,
        defaults: true,
      });
    } else {
      this._from.push({
        source: () => Promise.resolve(defaults),
        destination: '.',
        optional: false,
        defaults: true,
      });
    }

    return this;
  }

  public defaultsOptional(defaults: any | Source): this {
    if (typeof defaults === 'function') {
      this._from.push({
        source: defaults,
        destination: '.',
        optional: true,
        defaults: true,
      });
    } else {
      this._from.push({
        source: () => Promise.resolve(defaults),
        destination: '.',
        optional: true,
        defaults: true,
      });
    }

    return this;
  }

  public read(): Promise<void> {
    const promises = this._from.map(
      (from) => from.source()
        .then((source) => ({ ...from, source }))
        .catch((error) => {
          if (from.optional) {
            if (!error._zeroConfigOptional) {
              this._error(error);
            }

            return { ...from, source: undefined };
          }

          throw error;
        }),
    );

    return Promise.all(promises)
      .then((results) => {
        let data = this._data;

        // apply defaults
        Object.values(results)
          .filter(({ defaults }) => defaults === true)
          .forEach(({ source }) => {
            if (typeof source === 'undefined') {
              this._debug('skip undefined source for defaults');
              return;
            }

            data = deepmerge(data, source);
          });

        // set values
        Object.values(results)
          .filter(({ defaults }) => defaults === false)
          .forEach(({ source, destination }) => {
            if (typeof source === 'undefined') {
              this._debug(`skip undefined source for destination=${destination}`);
              return;
            }

            if (destination === '.') {
              data = deepmerge(data, source);
            } else {
              const currentValue = _get(data, destination);

              const isObjectOrArray = currentValue && currentValue != null
                && (typeof currentValue === 'object' || Array.isArray(currentValue));

              if (isObjectOrArray) {
                // deepmerge
                _set(data, destination, deepmerge(currentValue, source));
              } else {
                _set(data, destination, source);
              }
            }
          });

        this._data = data;
      });
  }

  public validation(validation: Validation): void {
    this._validation = validation;
  }

  public async validate(): Promise<void> {
    if (this._validation) {
      const valid = await this._validation(this._data);
      this._data = valid;
    }
  }

  private _clone(value: any): any {
    if (typeof value === 'undefined') {
      return value;
    }

    return JSON.parse(JSON.stringify(value));
  }

  private _debug(...args: any): void {
    if (this._logger) {
      this._logger.debug(...args);
    }
  }

  private _error(...args: any): void {
    if (this._logger) {
      this._logger.error(...args);
    }
  }
}
