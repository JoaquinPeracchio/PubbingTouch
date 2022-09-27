const mongoose = require('mongoose');
const logger = require('../helpers/logger');
const config = require('./env');

mongoose.Promise = global.Promise; // ES6 native promise library
mongoose.connect(config.mongodb.uri, config.mongodb.options, function(err, res) {
	err && logger.error('// ---- Error connecting to MongoDB', {error: err});
});

mongoose.connection.on('open', function() {
	(process.env.NODE_ENV !== 'testing') && logger.info('mongo'+ config.mongodb.uri+'## -------- Connected to MongoDB successfully!');
});

module.exports = mongoose.connections[0];
