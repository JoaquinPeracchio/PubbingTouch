'use strict';

const mongoose = require('mongoose');
const User     = mongoose.model('User');
const jwt      = require('jsonwebtoken');
const Bluebird = require('bluebird');
const Moment   = require('moment');
const logger   = require('../helpers/logger');
const Email    = require('../services/email');
const config   = require('../config/env');
const _ = require('lodash');

var userController = {};

userController.handleAuth = (req, res) => {
	const reqUser  = req.body;
	const email    = reqUser.email;
	const username = reqUser.username;
	const password = reqUser.password;
	const devType  = reqUser.devType;

	console.log('reqUser');
	console.log(reqUser);

	// User.findOne({ email:email, username:username }, function(err, userData) {
	User.findOne({$or: [
		{email: req.body.email},
		{username: req.body.email}
	]}, function(err, userData) {
	console.log('aca??');
	console.log('err', err);
	console.log('userData', userData);

		if(err) res.redirect('https://halecka.live/beta?message=errordb');
	
		// User found
		if(userData) {
			if (reqUser.email && reqUser.password) {
				return res.status(403).json({
					'status': 'error',
					'message': 'Ya existe una cuenta con ese email'
				});
			} else if (reqUser.username && reqUser.password) {
				return res.status(403).json({
					'status': 'error',
					'message': 'Ya existe una cuenta con ese nombre de usuario'
				});
			} else {
				// check if the account is currently locked
				if (userData.isLocked) {
						// just increment login attempts if account is already locked
						return userData.incLoginAttempts(function(err) {
							if (err) throw err;

							return res.status(403).json({
								'status': 'error',
								'message': 'Limite de intentos'
							});
						});
				}
				if (userData.password && req.params.token == null) {
					// test for a matching password
					userData.comparePassword(password, function(err, isMatch) {
							if (err) throw err;

							// check if the password was a match
							if (isMatch) {
									// if there's no lock or failed attempts, just return the userData
									if (!userData.loginAttempts && !userData.lockUntil)// return cb(null, userData);
									// reset attempts and lock info
									var updates = {
											$set: { loginAttempts: 0 },
											$unset: { lockUntil: 1 }
									};
									return userData.update(updates, function(err) {
										if (err) throw err;

										let data = {
											user: userData,
											device: devType,
											exp: parseInt(config.jwt.expirationTime),
											isRefreshing: false
										};
										return authController._generateToken(res, data);
									});
							}

							// password is incorrect, so increment login attempts before responding
							userData.incLoginAttempts(function(err) {
								if (err) throw err;

								return res.status(403).json({
									'status': 'error',
									'message': 'Contraseña incorrecta'
								});
							});
					});
				} else {
					return res.status(403).json({
						'status': 'error',
						'message': 'Ya existe una cuenta con ese email'
					});
				}
			}
			
		}

		if(!userData) {
			if (reqUser.firstname && 
					reqUser.lastname && 
					reqUser.email && 
					reqUser.password) {

				const data = {
					'email': reqUser.email
				};
				console.log('user register');


				// return authController._registerOwner(res, reqUser);
				return userController._register(req, res, reqUser);

			} else {
				console.log('user not found');
				return res.status(403).json({
					'status': 'error',
					'message': 'Correo electronico inexistente'
				});
			}
		}
	});
};

userController.edit = (req, res) =>  {
	User.findOne({_id: req.params.id}).exec(function (err, user) {
		if (err) {
			console.log("Error:", err); return;
		} else {
			res.render("../views/users/edit.html", {collection: user});
		}
	});
};
 
userController.update = (req, res) => {
	const body = req.body;
	const onlyNotEmpty = {};
	_(req.body).forEach((value,key) => {
		console.log(key + ' - ' + value)
		if (!_.isEmpty(value) || value != []){
			onlyNotEmpty[key] = value;
		}
	});

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

	User.findByIdAndUpdate( req.params.id, {
		$set: onlyNotEmpty
	}, { runValidators: true }, function( err, user) {
		if( err ) { 
			console.log('Error: ', err); 
			res.render('../views/user/edit.html', {collection: body} );
		} else {
			return res.json({ status:'success' });
		}
	});
};
 
// register user user
userController._register = (req, res, next) => {
	const body = req.body;

/*	const payload = jwt.decode(req.headers.authorization);

	if (payload.scope.role.indexOf('admin') > -1) {
		if (data.role == 'admin') {
			body.role  = 'admin';
		} else {
			body.role  = 'user';
		}
	} else {
		body.role  = 'user';
	}
*/
	var avatar = [];
	if (typeof body.avatar_name !== 'undefined') {
		if (body.avatar_name instanceof Array) {
			for (var i = 0; i < body.avatar_name.length; i++) {
				avatar.push({
					filename: body.avatar_name[i],
					file: body.avatar_file[i],
					id: body.avatar_id[i],
					title: body.avatar_title[i],
					expiration: body.avatar_expiration[i]
				});
			}
		} else {
			avatar.push({
				filename: body.avatar_name,
				file: body.avatar_file,
				id: body.avatar_id,
				title: body.avatar_title,
				expiration: body.avatar_expiration
			});
		}
	}

	let user = new User();
	User.create({
		createAt: 							Date.now(),
		provider: 							'halecka',
		avatar: 							avatar,
		firstname: 							body.firstname,
		lastname: 							body.lastname,
		username: 							body.username,
		gender: 							body.gender,
		email: 								body.email,
		dialCode: 							body.dialCode,
		country: 							body.country,
		region: 							body.region,
		city: 								body.city,
		address: 							body.address,
		department: 						body.department,
		postal: 							body.postal,
		timezoneStr: 						body.timezoneStr,
		locale: 							body.locale,
		accountType: 						body.accountType,
		cuit: 								body.cuit,
		role: 								body.role,
		actions: 							body.actions,
		password: 							body.password,
		status: 							body.status
	}, function (err, result) {
		if(err) {
			console.log(err);
			logger.error('Error saving user record ', { msg:err });
			return next(err);
		} else {
			logger.debug(User);
			logger.debug('New user record', { tag:'new User' });
			return res.json({ status:'success' });
		}
	});
};


// Get all user
userController.getList = (req, res, next) => {
	// req.user ==> jwt payload
	User
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

userController.getRelated = function(req, res) { 
	const payload = jwt.decode(req.headers.authorization);
	let response = {};
	if (req.user.scope.role == 'owner') {
		console.log('owner');
		User
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
		User.find({staff_users : {$elemMatch : { _id : payload.sub }}}, (err, data) => {
			res.status(200).json({ collection: data });
		});
	}
};

userController.getUser = (req, res) => { 
  console.log('getuser');
  const payload = jwt.decode(req.headers.authorization);
  let response = {};
  console.log(payload);

  User.findOne({ _id: payload.sub }, (err, user) => {
      if(err) res.status(400).json({ response: 'Se produjo un error en la solicitud' });

      if(!user) res.status(404).json({ response: 'No se encontro el usuario' });

      const date = user.premiumExpirationDate ? new Date(user.premiumExpirationDate) : new Date(0);
      const dNow = new Date();

      let response = {};
      response._id    = user._id;
      response.firstname    = user.firstname;
      response.lastname    = user.lastname;
      response.username    = user.username;
      response.role    = user.role;
      response.avatar    = user.avatar;
      response.email     = user.email;
      console.log(response);
      res.status(200).json(response);

    });
};

userController.getByMail = (req, res) => { 
  console.log('getuser');
  let findUser = req.body.search;
  let response = {};

console.log(req.body);
console.log('findUser------------------------------');
console.log(findUser);
  // User.findOne({ email: findUser }, (err, data) => {
	User.findOne({$or: [
		{email: findUser},
		{username: findUser}
	]}, function(err, data) {
		if(err) {
			logger.error('Errora', { msg:err });
			return next(err);
		}
		return res.json({ collection: data });
		// if(err) res.status(400).json({ response: 'Se produjo un error en la solicitud' });

		// if(!data) res.status(404).json({ response: 'No se encontro el usuario' });

		// let response = {data};
		// console.log(response);
		// res.status(200).json(data);
	});
};

// delete User
userController.delete = function(req, res, next) {
	User.findById(req.params.id, function(err, User) {
		if(!User) {
			var error = new Error('User not found');
				console.log(error)
					error.status = 404;
			return next(error);
		}
		return User.remove(function(err) {
			if(err) {
				console.log(err);
				logger.error('Internal error', { err:err });
				return next(err);
			}
			else {
				console.log('delete');
				var deletedUser = {
					status: 'success',
					deletedid: req.params.id
				};
				return res.json(deletedUser);
			}
		});
	});
};

// Get all user populated (with users info)
userController.getPopulated = (req, res, next) => {
	User
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

// Get all user populated (with users info)
userController.addCompany = (compId, userId, role, res, next) => {

console.log('addcompany-------------------++++++++++++++++++')
	// const body = req.body;
	const onlyNotEmpty = {};
	_(compId).forEach((value,key) => {
		console.log(key + ' - ' + value)
		if (!_.isEmpty(value) || value != []){
			onlyNotEmpty[key] = value;
		}
	});

	compId
	if (compId.length > 0) {
		onlyNotEmpty['compId'] = compId;
	}

	User.findByIdAndUpdate( userId, {
		$set: onlyNotEmpty
	}, { runValidators: true }, function( err, user) {
		if( err ) { 
			console.log('Error: ', err); 
			res.render('../views/user/edit.html', {collection: body} );
		} else {
			return res.json({ status:'success' });
		}
	});
};
userController.update = (req, res) => {
	const body = req.body;
	const onlyNotEmpty = {};
	_(req.body).forEach((value,key) => {
		console.log(key + ' - ' + value)
		if (!_.isEmpty(value) || value != []){
			onlyNotEmpty[key] = value;
		}
	});

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

};
 

module.exports = userController;