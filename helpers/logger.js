const winston = require('winston');
let env = process.env.NODE_ENV || 'development';

let logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			level: (env === 'development') ? 'debug' : 'info',
			handleExceptions: true,
			humanReadableUnhandledException:true,
			json: false,
			colorize: true,
			timestamp: true
		})
	],
	exitOnError: false
});

module.exports = logger;
module.exports.stream = {
	write: function(message, encoding) {
		logger.info(message);
	}
};