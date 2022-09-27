'use strict';

let mongoose = require('mongoose');
let schema = new mongoose.Schema({
  createdAt  : { type: String, required: false },  // issued at - fecha de creacion del token
  tokenId    : { type: String, required: false },  // json token id - el identificador unico del token
  user_id    : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // jshint ignore: line
  deviceType : { type: String, required: false },  // Ej. desktop, tv, tablet, phone, bot or car
  deviceName : { type: String, required: false }    // Ej. Gonzzalo's iPhone
});

// When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema.
// While nice for development, it is recommended this behavior be disabled in production since index creation can cause
// a significant performance impact. Disable the behavior by setting the autoIndex option of your schema to false.
schema.set('autoIndex', false);

module.exports = {
  'Token': mongoose.model('Token', schema)
};