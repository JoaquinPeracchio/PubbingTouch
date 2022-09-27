'use strict';

const mongoose = require('mongoose');
const Notification = mongoose.model('Notification');
const jwt      = require('jsonwebtoken');
const logger = require('../helpers/logger');
const authMiddleware = require('../middlewares/auth');
const _ = require('lodash');

var notificationController = {};

notificationController.edit = (req, res) =>  {

	Notification.findOne({_id: req.params.id}).exec(function (err, notification) {
	if (err) { console.log("Error:", err); return; }
	
	console.log('####################$##############');
	console.log(notification);
	res.render("../views/notification/edit.html", {collection: notification});
	
	});
};
 
notificationController.update = (req, res) => {

	const body = req.body;

	const onlyNotEmpty = {};
	_(req.body).forEach((value,key) => {
		console.log(key + ' - ' + value)
	    if (!_.isEmpty(value) || value != []){
	        onlyNotEmpty[key] = value;
	    }
	});

	var files = [];
	if (typeof body.files_name !== 'undefined') {
		if (body.files_name instanceof Array) {
			for (var i = 0; i < body.files_name.length; i++) {
				files.push({
					filename: body.files_name[i],
					file: body.files_file[i],
					id: body.files_id[i],
					expiration: body.files_expiration[i],
					filetypes: body.files_filetypes[i]
				});
			}
		} else {
			files.push({
				filename: body.files_name,
				file: body.files_file,
				id: body.files_id,
				expiration: body.files_expiration,
				filetypes: body.files_filetypes
			});
		}
	}

	Notification.findByIdAndUpdate( req.params.id, {
		$push: {
			files
		},
		$set: onlyNotEmpty
	}, { runValidators: true }, function( err, notification) {
		if( err ) { 
			console.log('Error: ', err); 
			res.render('../views/notification/edit.html', {collection: body} );
		} else {
			return res.json({ status:'success' });
		}
		
	});
};
 
// register user notification
notificationController.register = (req, res, next) => {

	// TODO: validate all!!!
	const body = req.body;

	var files = [];
	if (typeof body.files_name !== 'undefined') {
		if (body.files_name instanceof Array) {
			for (var i = 0; i < body.files_name.length; i++) {
				files.push({
					filename: body.files_name[i],
					file: body.files_file[i],
					id: body.files_id[i],
					expiration: body.files_expiration[i],
					filetypes: body.files_filetypes[i]
				});
			}
		} else {
			files.push({
				filename: body.files_name,
				file: body.files_file,
				id: body.files_id,
				expiration: body.files_expiration,
				filetypes: body.files_filetypes
			});
		}
	}

// console.log(body);
	let notification = new Notification();
	Notification.create({
		createAt: Date.now(),
		titlename: body.titlename,
		category: body.category,
		parent: body.parent,
		related_id: body.related_id,
		files: files,
		percent: body.percent,
		expiration: body.expiration,
		comment: body.comment,
		status: body.status
	}, function (err, result) {
		if(err) {
			console.log(err);
			logger.error('Error saving notification record ', { msg:err });
			// assert.equal(err, null);
			return next(err);
		} else {
			logger.debug(Notification);
			logger.debug('New notification record', { tag:'newNotification' });
			// assert.equal(3, result.result.n);
			// assert.equal(3, result.ops.length);
			console.log("Inserted 3 documents into the collection");
			// callback(result);
			return res.json({ status:'success' });
		}
		// if (err) return handleError(err);
		// saved!
	});
};


// Get all notification
notificationController.getList = (req, res, next) => {
	// req.user ==> jwt payload
	Notification
		.find()
		.lean()
		.limit(100)
		.exec(function(err, data) {
		if(err) {
			logger.error('Errora', { msg:err });
			return next(err);
		}
		return res.json({ collection: data });
	});
};

notificationController.getRelated = function(req, res) { 
	const payload = jwt.decode(req.headers.authorization);
	const parentEl = req.body.parent;
	const filterBy = req.body.filter;
	const state = req.body.status;

	let response = {};

	var filterQuery = { parent : parentEl };

	if ( filterBy != '' ) {
		if (filterBy.charAt(0) != '!') {
			filterQuery['category'] = filterBy;
		} else {
			filterQuery['category'] = { $ne: filterBy.substr(1) }
		}
	}
	if ( state != '' ) {
		if (state.charAt(0) != '!') {
			filterQuery['status'] = state;
		} else {
			filterQuery['status'] = { $ne: state.substr(1) }
		}
	}

	Notification.find(filterQuery, (err, data) => {
		res.status(200).json({ collection: data });
	}).sort( { createAt: -1 } );
};

// delete Notification
notificationController.delete = function(req, res, next) {
	Notification.findById(req.params.id, function(err, Notification) {
		if(!Notification) {
			var error = new Error('Notification not found');
				console.log(error)
					error.status = 404;
			return next(error);
		}
		return Notification.remove(function(err) {
			if(err) {
				console.log(err);
				logger.error('Internal error', { err:err });
				return next(err);
			}
			else {
				console.log('delete');
				var deletedNotification = {
					status: 'success',
					deletedid: req.params.id
				};
				return res.json(deletedNotification);
			}
		});
	});
};

// Get all notification populated (with users info)
notificationController.getPopulated = (req, res, next) => {
	Notification
		.find()
		.populate({path:'user_id', select:'email gender locale ageMin ageMax timezone'})
		.lean()
		.limit(100)
		.exec(function(err, data) {
		if(err) {
			logger.error('Error1', { msg:err });
			return next(err);
		}
		return res.json({ collection:data });
	});
};

module.exports = notificationController;