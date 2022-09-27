'use strict';

const _ = require('lodash/string');
const http  = require('request');
const config = require('../config/env');
const logger = require('../helpers/logger');
const generateJwtToken = require('../helpers/auth').generateJwtToken;
const authMiddleware = require('../middlewares/auth');
const jwt      = require('jsonwebtoken');

const mongoose = require('mongoose');
const User     = mongoose.model('User');
const Company     = mongoose.model('Company');

var authController = {};

authController._generateToken = (res, data) => { 
	let provider = data.user.provider;
	let user = data.user;
	let device = data.device;
	let exp = data.exp;
	let isRefreshing = data.isRefreshing;

	generateJwtToken(user, device, exp, isRefreshing, function(error, token) {
		if(error) {
			logger.error('Error generating user token. ', {
				user: user, 
				expTime: exp, 
				detail: error 
			});
			return res.json({
				'code': 500,
				'status': 'error',
				'message': 'Error generating access_token. Please try again later'
			});
		}

		let response = {
			'code'         : 200,
			'status'       : 'success',
			'firstname'    : user.firstname,
			'lastname'     : user.lastname,
			'avatar'       : user.avatar,
			 // long live token for frontend 
			//https://developers.facebook.com/docs/facebook-login/access-tokens/expiration-and-extension
			'access_token' : token.access_token || null  // jshint ignore:line
		};

		if(device.type !== 'Web') response.refresh_token = token.refresh_token || null;  // jshint ignore:line
		return res.json(response); // Listo, devuelvo al usuario
	});
};

/**
 * Funcion privada para registrar un nuevo 
 * usuario
 */

authController._registerUser = (req, res, data) => {
	let newUser = new User();

	newUser.provider  = 'halecka';
	newUser.avatar = data.avatar_name || 'userImage.png';
	newUser.firstname = data.firstname || null;
	newUser.lastname  = data.lastname || null;
	newUser.email     = data.email || null;
	newUser.username  = data.username || null;
	newUser.isVinculated  = data.isVinculated || false;
	newUser.transportCompany  = data.transportCompany || 'Sin Asignar';
	newUser.isPartTransportGroup  = data.isPartTransportGroup || false;
	newUser.transportGroupName  = data.transportGroupName || 'Sin Asignar';
	newUser.password  = data.password || null;
	newUser.locale    = data.lang || null;
	newUser.timezoneStr = data.time_zone || null;
	newUser.phone     = data.phone || null;
	newUser.gender    = data.gender || null;
	newUser.dialCode  = data.dialCode || null;

	newUser.actions  = data.actions || null;

	const payload = jwt.decode(req.headers.authorization);

	if (payload.scope.role.indexOf('owner') > -1) {
		newUser.role  = data.role || 'user';
	} else if (payload.scope.role.indexOf('admin') > -1) {
		if (data.role == 'admin') {
			newUser.role  = 'admin';
		} else {
			newUser.role  = 'user';
		}
	} else {
		newUser.role  = 'user';
	}

	newUser.save((err, doc) => {
		if(err) return  res.status(500).json({ 
			'error': 'error', 
			'message': 'No se pudo guardar el usuario. Intente nuevamente.' 
		});

		let user = {
			user: newUser,
			device: data.devType || 'Web',
			exp: parseInt(config.jwt.expirationTime),
			isRefreshing: false
		};

		return authController._generateToken(res, user);
	});
};

/**
 * Autenticación por Login Propietario. Puede ser un nuevo usuario
 * o un login de un usuario ya existente
 * Todas las validaciones se realizan en el Middleware
 */

authController.handleAuth = (req, res) => {
	const reqUser  = req.body;
	const email    = reqUser.email;
	const password = reqUser.password;
	const devType  = reqUser.devType;

console.log(reqUser);

	// User.findOne({ email:email }, function(err, userData) {
	User.findOne({$or: [
		{email: req.body.email},
		{username: req.body.email}
	]}, function(err, userData) {

		if(err) res.redirect('https://halecka.live/beta?message=errordb');
	
		// User found
		console.log(userData);
		if(userData) {
			if (reqUser.firstname && reqUser.lastname && reqUser.email && reqUser.password) {
				return res.status(403).json({
					'status': 'error',
					'message': 'Ya existe una cuenta con ese email'
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

				// return authController._registerOwner(res, reqUser);
				return authController._registerUser(req, res, reqUser);

			} else {
				return res.status(403).json({
					'status': 'error',
					'message': 'Correo electronico inexistente'
				});
			}
		}
	});
};

module.exports = authController;
