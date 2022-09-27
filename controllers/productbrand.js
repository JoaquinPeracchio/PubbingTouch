'use strict';

const mongoose = require('mongoose');
const ProductBrand = mongoose.model('ProductBrand');
const jwt      = require('jsonwebtoken');
const logger = require('../helpers/logger');
const authMiddleware = require('../middlewares/auth');
const _ = require('lodash');

var productBrandController = {};

// register user productBrand
productBrandController.register = (req, res, next) => {
	const body = req.body;

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

	var products = [];
	if (typeof body.products_name !== 'undefined') {
		if (body.products_name instanceof Array) {
			for (var i = 0; i < body.products_name.length; i++) {
				products.push({
					name: body.products_name[i],
					measure: body.products_measure[i],
					category: body.products_category[i],
					sort: body.products_sort[i],
					description: body.products_description[i],
					comestible: body.products_comestible[i],
					fuente: body.products_fuente[i],
					variant: body.products_variant[i],
					nutritional: body.products_nutritional[i],
					status: body.products_status[i]
				});
			}
		} else {
			products.push({
				name: body.products_name,
				measure: body.products_measure,
				category: body.products_category,
				sort: body.products_sort,
				description: body.products_description,
				comestible: body.products_comestible,
				fuente: body.products_fuente,
				variant: body.products_variant,
				nutritional: body.products_nutritional,
				status: body.products_status
			});
		}
	}

	let productBrand = new ProductBrand();
	ProductBrand.create({
		createAt: Date.now(),
		user_id: req.user.sub,
		avatar: avatar,
		titlename: body.titlename,
		slogan: body.slogan,
		description: body.description,
		products: products,
		status: body.status
	}, function (err, result) {
		if(err) {
			console.log(err);
			logger.error('Error saving productBrand record ', { msg:err });
			// assert.equal(err, null);
			return next(err);
		} else {
			logger.debug(ProductBrand);
			logger.debug('New productBrand record', { tag:'new ProductBrand' });
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

productBrandController.edit = (req, res) =>  {
	ProductBrand.findOne({_id: req.params.id}).exec(function (err, productBrand) {
		if (err) {
			console.log("Error:", err); return;
		} else {
			res.render("../views/brand/edit.html", {collection: productBrand});
		}
	});
};
 
productBrandController.update = (req, res) => {
	const body = req.body;
	const payload = jwt.decode(req.headers.authorization);

	console.log(payload.productBrand);

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

	var products = [];
	if (typeof body.products_name !== 'undefined') {
		if (body.products_name instanceof Array) {
			for (var i = 0; i < body.products_name.length; i++) {
				products.push({
					name: body.products_name[i],
					measure: body.products_measure[i],
					category: body.products_category[i],
					sort: body.products_sort[i],
					description: body.products_description[i],
					comestible: body.products_comestible[i],
					fuente: body.products_fuente[i],
					variant: body.products_variant[i],
					nutritional: body.products_nutritional[i],
					status: body.products_status[i]
				});
			}
		} else {
			products.push({
				name: body.products_name,
				measure: body.products_measure,
				category: body.products_category,
				sort: body.products_sort,
				description: body.products_description,
				comestible: body.products_comestible,
				fuente: body.products_fuente,
				variant: body.products_variant,
				nutritional: body.products_nutritional,
				status: body.products_status
			});
		}
	}
	onlyNotEmpty['products'] = products;

	ProductBrand.findByIdAndUpdate( req.params.id, {
		// $push: {
		// 	avatar
		// },
		$set: onlyNotEmpty
	}, { runValidators: true }, function( err, productBrand) {
		if( err ) { 
			console.log('Error: ', err); 
			res.render('../views/productBrand/edit.html', {collection: body} );
		} else {
			return res.json({ status:'success' });
		}
	});
};

productBrandController.getRelated = function(req, res) { 
	console.log('getramales');
	const payload = jwt.decode(req.headers.authorization);
	const parentEl = req.body.relatedEl;
	console.log(req.body);
	console.log(parentEl);
	console.log('payload');

	let response = {};
	console.log(payload.sub);

	ProductBrand.find({
		parent : parentEl
	}, (err, data) => {
		res.status(200).json({ collection: data });
	}).sort( { createAt: -1 } );
};

productBrandController.getBy = function(req, res) { 
	console.log('getramales');
	const parentEl = req.body.search;
	console.log(req.body);
	console.log(parentEl);
	console.log('marca');

	let response = {};

	ProductBrand.find({
		titlename: {
			$regex: parentEl
		}
	}, (err, data) => {
		res.status(200).json({ collection: data });
	})
	.limit(20)
	.sort( { createAt: -1 } );
};

// Get all productBrand
productBrandController.getList = (req, res, next) => {
	// req.user ==> jwt payload
	ProductBrand
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

// Get all productBrand populated (with users info)
productBrandController.getPopulated = (req, res, next) => {
	ProductBrand
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

// delete ProductBrand
productBrandController.delete = function(req, res, next) {
	ProductBrand.findById(req.params.id, function(err, ProductBrand) {
		if(!ProductBrand) {
			var error = new Error('ProductBrand not found');
				console.log(error)
					error.status = 404;
			return next(error);
		}
		return ProductBrand.remove(function(err) {
			if(err) {
				console.log(err);
				logger.error('Internal error', { err:err });
				return next(err);
			}
			else {
				console.log('delete');
				var deletedProductBrand = {
					status: 'success',
					deletedid: req.params.id
				};
				return res.json(deletedProductBrand);
			}
		});
	});
};

module.exports = productBrandController;