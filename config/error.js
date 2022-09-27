const logger = require('../helpers/logger');

// TODO. Do not send errors to user!!
// env = process.env.NODE_ENV
module.exports = function(app, env) {

	/**************************************************
	* Catch 404 and forward to error handler
	**************************************************/
	app.use(function(req, res, next) {
		let err = new Error('Not Found');
			err.status = 404;
		next(err);
	});

	/**************************************************
	* Catch 401 & 403 erros
	* For production and development
	**************************************************/
	app.use(function(err, req, res, next) {
		if(err.status === 401 || err.status === 403) {
			logger.debug('Error handler 401 || 403; ', { err:err });
			res.status(err.status);
			let response = {
				status: 'error',
				code: err.status,
				msg: err.status === 401 ? 'Unauthorized' : 'Forbidden'
			};
			res.json(response);
		}
		else {
			next(err);
		}
	});

	/**************************************************
	* Development error handler
	* Will print stacktrace
	**************************************************/
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			let status = err.status || 500;
			logger.error('Error handler que paso?', { err:err });
			res.status(status);
			let response = {
				status: 'error',
				code: status,
				msg: err.message || err.msg,
				stack: err
			};
			res.json(response);
		});
	}

	/**************************************************
	* Production error handler
	* No stacktraces leaked to user
	**************************************************/
	app.use(function(err, req, res, next) {
		let status = err.status || 500;
		res.status(status);
		logger.error('Error handler', { err:err });
		let response = {
			status: 'error',
			code: status,
			msg: err.message || err.msg
		};
		res.json(response);
	});
	
};