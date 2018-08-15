/* eslint-disable no-console */

// let joi = require('joi');

const Config = require(`${__dirname}/../lib/Config`).default;

const config = new Config();


config.validation(raw => new Promise(((resolve, reject) => {
    resolve({});
  // let schema = joi.object().required().keys({
  //     host: joi.string().allow(null).required(),
  //     port: joi.number().required()
  // });
  //
  // joi.validate(raw, schema, {convert: true}, function(error, valid) {
  //     if (error) {
  //         return reject(error);
  //     }
  //
  //     resolve(valid);
  // });
})));


config
  .set('.', { host: null, port: '80' })
  .setImmutable(true)
  .validate()
  .then(() => {
    console.log(config.get('.'));
  })
  .catch((error) => {
    console.log(error);
  });

/* eslint-enable no-console */
