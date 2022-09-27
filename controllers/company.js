'use strict';

const mongoose = require('mongoose');
const Company = mongoose.model('Company');
const User = require('./users');
const jwt      = require('jsonwebtoken');
const logger = require('../helpers/logger');
const authMiddleware = require('../middlewares/auth');
const _ = require('lodash');

var companyController = {};

companyController.edit = (req, res) =>  {
	Company.findOne({_id: req.params.id}).exec(function (err, company) {
		if (err) {
			console.log("Error:", err); return;
		} else {
			res.render("../views/company/edit.html", {collection: company});
		}
	});
};

// register user company
companyController.register = (req, res, next) => {
	const body = req.body;

	var staff_users = [];
	if (typeof body.staff_user !== 'undefined') {
		if (body.staff_user instanceof Array) {
			for (var i = 0; i < body.staff_user.length; i++) {
				staff_users.push({
					_id: body.staff_user[i],
					actions: body.role[i]
				});
			}
		} else {
			staff_users.push({
				_id: body.staff_user,
				actions: body.role
			});
		}
	}

	var avatar = [];
	if (typeof body.avatar_name !== 'undefined') {
		if (body.avatar_name instanceof Array) {
			for (var i = 0; i < body.avatar_name.length; i++) {
				avatar.push({
					filename: body.avatar_name[i],
					file: body.avatar_file[i],
					id: body.avatar_id[i],
					title: body.avatar_title[i]
				});
			}
		} else {
			avatar.push({
				filename: body.avatar_name,
				file: body.avatar_file,
				id: body.avatar_id,
				title: body.avatar_title
			});
		}
	}

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

	let company = new Company();
	Company.create({
		createAt: Date.now(),
		avatar: avatar,
		titlename: body.titlename,
		slogan: body.slogan,
		cuit: body.cuit,
		address: body.address,
		department: body.department,
		city: body.city,
		region: body.region,
		country: body.country,
		postal: body.postal,
		phone: body.phone,
		location_lat: body.lat,
		location_lon: body.lon,
		files: files,
		admin_id: body.admin_id,
		status: body.status
	}, function (err, result) {
		if(err) {
			console.log(err);
			logger.error('Error saving company record ', { msg:err });
			// assert.equal(err, null);
			return next(err);
		} else {
			logger.debug(Company);
			logger.debug('New company record', { tag:'new Company' });

	if (typeof body.staff_user !== 'undefined') {
		if (body.staff_user instanceof Array) {
			for (var i = 0; i < body.staff_user.length; i++) {
				User.addCompany(result._id, body.staff_user[i], body.role[i]);
			}
		} else {
			User.addCompany(result._id, body.staff_user, body.role, res, next);
		}
	}
			// for (var i = 0; i < body.staff_user.length; i++) {
			// 	User.addCompany(result._id staff_users);
			// }
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

companyController.update = (req, res) => {
	const body = req.body;
	// const payload = jwt.decode(req.headers.authorization);

	const onlyNotEmpty = {};
	_(req.body).forEach((value,key) => {
		console.log(key + ' - ' + value)
		if (!_.isEmpty(value) || value != []){
			onlyNotEmpty[key] = value;
		}
	});

	var staff_users = [];
	if (typeof body.staff_id !== 'undefined') {
		if (body.staff_id instanceof Array) {
			for (var i = 0; i < body.staff_id.length; i++) {
				staff_users.push({
					_id: body.staff_id[i],
					name: body.staff_name[i],
					actions: body.staff_actions[i]
				});
			}
		} else {
			staff_users.push({
				_id: body.staff_id,
				name: body.staff_name,
				actions: body.staff_actions
			});
		}
	}
	onlyNotEmpty['staff_users'] = staff_users;

	var avatar = [];
	if (typeof body.avatar_file !== 'undefined') {
		if (body.avatar_file instanceof Array) {
			for (var i = 0; i < body.avatar_file.length; i++) {
				avatar.push({
					file: body.avatar_file[i],
					id: body.avatar_id[i]
				});
			}
		} else {
			avatar.push({
				file: body.avatar_file,
				id: body.avatar_id
			});
		}
	}
	if (avatar.length > 0) {
		onlyNotEmpty['avatar'] = avatar;
	}

	var files = [];
	if (typeof body.files_name !== 'undefined') {
		if (body.files_name instanceof Array) {
			for (var i = 0; i < body.files_name.length; i++) {
				files.push({
					filename: body.files_name[i],
					file: body.files_file[i] || 'undefined',
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

	Company.findByIdAndUpdate( req.params.id, {
		$push: {
			files
		},
		$set: onlyNotEmpty
	}, { runValidators: true }, function( err, collection) {
		if( err ) { 
			console.log('Error: ', err); 
			res.render('../views/lineas/edit.html', {collection: body} );
		} else {
			return res.json({ status:'success' });
		}
		
	});
}; 

// Get all company
companyController.getList = (req, res, next) => {
	// req.user ==> jwt payload
	Company
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

companyController.getRelated = function(req, res) { 
	const payload = jwt.decode(req.headers.authorization);
	let response = {};
	if (req.user.scope.role == 'owner') {
		console.log('owner');
		Company
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
	} else {
		console.log('notOwner');
		Company.find({staff_users : {$elemMatch : { _id : payload.sub }}}, (err, data) => {
			res.status(200).json({ collection: data });
		});
	}
};

companyController.related = function(req, res) { 
	console.log('getlineas');
	const payload = jwt.decode(req.headers.authorization);
	const parentEl = req.body.parent;
	console.log(parentEl);
	console.log('payload');

	let response = {};

	Company.find({
		parent : parentEl
	}, (err, data) => {
		res.status(200).json({ collection: data });
	}).sort( { number: 1 } );
};

// delete Company
companyController.delete = function(req, res, next) {
	Company.findById(req.params.id, function(err, Company) {
		if(!Company) {
			var error = new Error('Company not found');
				console.log(error)
					error.status = 404;
			return next(error);
		}
		return Company.remove(function(err) {
			if(err) {
				console.log(err);
				logger.error('Internal error', { err:err });
				return next(err);
			}
			else {
				console.log('delete');
				var deletedCompany = {
					status: 'success',
					deletedid: req.params.id
				};
				return res.json(deletedCompany);
			}
		});
	});
};

// Get all company populated (with users info)
companyController.getPopulated = (req, res, next) => {
	Company
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

module.exports = companyController;