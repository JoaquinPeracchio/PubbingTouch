'use strict';

const mongoose = require('mongoose');
const Stock = mongoose.model('Stock');
const Category = mongoose.model('Category');
const jwt      = require('jsonwebtoken');
const logger = require('../helpers/logger');
const authMiddleware = require('../middlewares/auth');
const _ = require('lodash');

var stockController = {};

// register user stock
stockController.register = (req, res, next) => {
	const body = req.body;

	var variant = [];
	if (typeof body.variant_sku !== 'undefined') {
		if (body.variant_sku instanceof Array) {
			for (var i = 0; i < body.variant_sku.length; i++) {
				variant.push({
					sku: body.variant_sku[i],
					last_buy: body.variant_last_buy[i],
					price: body.variant_price[i],
					stock: body.variant_stock[i],
					stock_alert: body.variant_stock_alert[i]
				});
			}
		} else {
			variant.push({
				sku: body.variant_sku,
				last_buy: body.variant_last_buy,
				price: body.variant_price,
				stock: body.variant_stock,
				stock_alert: body.variant_stock_alert
			});
		}
	}

	console.log('body');
	console.log(body);

	let stock = new Stock();
	Stock.create({
		createAt: Date.now(),
		parent: body.parent,
		location: body.location,
		productId: body.productId,
		variant: variant,
	}, function (err, result) {
		if(err) {
			console.log(err);
			logger.error('Error saving stock record ', { msg:err });
			// assert.equal(err, null);
			return next(err);
		} else {
			logger.debug(Stock);
			logger.debug('New stock record', { tag:'new Stock' });
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

stockController.edit = (req, res) =>  {
	Stock.findOne({_id: req.params.id}).exec(function (err, stock) {
		if (err) {
			console.log("Error:", err); return;
		} else {
			res.render("../views/stock/edit.html", {collection: stock});
		}
	});
};
 
stockController.update = (req, res) => {
	const body = req.body;
	const payload = jwt.decode(req.headers.authorization);

	console.log(payload.stock);

	const onlyNotEmpty = {};
	_(req.body).forEach((value,key) => {
		console.log(key + ' - ' + value)
		if (!_.isEmpty(value) || value != []){
			onlyNotEmpty[key] = value;
		}
	});

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
	onlyNotEmpty['avatar'] = avatar;

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

	Stock.findByIdAndUpdate( req.params.id, {
		$push: {
			nutritional
		},
		$set: onlyNotEmpty
	}, { runValidators: true }, function( err, stock) {
		if( err ) { 
			console.log('Error: ', err); 
			res.render('../views/stock/edit.html', {collection: body} );
		} else {
			return res.json({ status:'success' });
		}
	});
};

stockController.getRelated = function(req, res) { 
	const payload = jwt.decode(req.headers.authorization);
	const parentEl = req.body.relatedEl;
	console.log(parentEl);
	console.log('payload');

	let response = {};

	Stock.find({
		parent : parentEl
	}, (err, data) => {
		console.log('data', data);
		res.status(200).json({ collection: data });
	}).sort( { number: 1 } );
};

// Get all stock
stockController.getList = (req, res, next) => {
	// req.user ==> jwt payload
	Stock
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

// Get all stock populated (with users info)
stockController.getPopulated = (req, res, next) => {
	Stock
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

// delete Stock
stockController.delete = function(req, res, next) {
	Stock.findById(req.params.id, function(err, Stock) {
		if(!Stock) {
			var error = new Error('Stock not found');
				console.log(error)
					error.status = 404;
			return next(error);
		}
		return Stock.remove(function(err) {
			if(err) {
				console.log(err);
				logger.error('Internal error', { err:err });
				return next(err);
			}
			else {
				console.log('delete');
				var deletedStock = {
					status: 'success',
					deletedid: req.params.id
				};
				return res.json(deletedStock);
			}
		});
	});
};

module.exports = stockController;
