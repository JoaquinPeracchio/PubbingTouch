'use strict';

const mongoose = require('mongoose');
const ProductVars = mongoose.model('ProductVars');
const Category = mongoose.model('Category');
const jwt      = require('jsonwebtoken');
const logger = require('../helpers/logger');
const authMiddleware = require('../middlewares/auth');
const _ = require('lodash');

var productVarsController = {};

// register user productVars
productVarsController.register = (req, res, next) => {
	const body = req.body;
	console.log('body', req.body);

	var variant = [];
	if (typeof body.variant_name !== 'undefined') {
		if (body.variant_name instanceof Array) {
			for (var i = 0; i < body.variant_name.length; i++) {
				variant.push({
					sku: body.variant_sku[i],
					barcode: body.variant_barcode[i],
					item_content: body.variant_item_content[i],
					titlename: body.variant_titlename[i],
					image: body.variant_image[i],
					sort: body.variant_sort[i],
					description: body.variant_description[i]
				});
			}
		} else {
			variant.push({
				sku: body.variant_sku,
				barcode: body.variant_barcode,
				item_content: body.variant_item_content,
				titlename: body.variant_titlename,
				image: body.variant_image,
				sort: body.variant_sort,
				description: body.variant_description
			});
		}
	}

	var nutritional = [];
	if (typeof body.calorias !== 'undefined') {
		if (body.calorias instanceof Array) {
			for (var i = 0; i < body.calorias.length; i++) {
				nutritional.push({
					calorias: body.calorias[i],
					proteinas: body.proteinas[i],
					lipidos: body.lipidos[i],
					agsaturados: body.agsaturados[i],
					agmonoinsaturados: body.agmonoinsaturados[i],
					agpoliinsaturados: body.agpoliinsaturados[i],
					omega3: body.omega3[i],
					omega6: body.omega6[i],
					colesterol: body.colesterol[i],
					carbohidratos: body.carbohidratos[i],
					fibra: body.fibra[i],
					agua: body.agua[i],
					calcio: body.calcio[i],
					hierro: body.hierro[i],
					yodo: body.yodo[i],
					magnesio: body.magnesio[i],
					zinc: body.zinc[i],
					sodio: body.sodio[i],
					potasio: body.potasio[i],
					fosforo: body.fosforo[i],
					selenio: body.selenio[i],
					tiamina: body.tiamina[i],
					riboflavina: body.riboflavina[i],
					niacina: body.niacina[i],
					vitamina_b6: body.vitamina_b6[i],
					folatos: body.folatos[i],
					vitamina_b12: body.vitamina_b12[i],
					vitamina_c: body.vitamina_c[i],
					vitamina_a: body.vitamina_a[i],
					vitamina_d: body.vitamina_d[i],
					vitamina_e: body.vitamina_e[i]
				});
			}
		} else {
			nutritional.push({
				calorias: body.calorias,
				proteinas: body.proteinas,
				lipidos: body.lipidos,
				agsaturados: body.agsaturados,
				agmonoinsaturados: body.agmonoinsaturados,
				agpoliinsaturados: body.agpoliinsaturados,
				omega3: body.omega3,
				omega6: body.omega6,
				colesterol: body.colesterol,
				carbohidratos: body.carbohidratos,
				fibra: body.fibra,
				agua: body.agua,
				calcio: body.calcio,
				hierro: body.hierro,
				yodo: body.yodo,
				magnesio: body.magnesio,
				zinc: body.zinc,
				sodio: body.sodio,
				potasio: body.potasio,
				fosforo: body.fosforo,
				selenio: body.selenio,
				tiamina: body.tiamina,
				riboflavina: body.riboflavina,
				niacina: body.niacina,
				vitamina_b6: body.vitamina_b6,
				folatos: body.folatos,
				vitamina_b12: body.vitamina_b12,
				vitamina_c: body.vitamina_c,
				vitamina_a: body.vitamina_a,
				vitamina_d: body.vitamina_d,
				vitamina_e: body.vitamina_e
			});
		}
	}

	let productVars = new ProductVars();
	ProductVars.create({
		createAt: Date.now(),
		brand: body.brand,
		measure: body.measure,
		category: body.category,
		sort: body.sort,
		description: body.description,
		comestible: body.comestible,
		fuente: body.fuente,
		variant: variant,
		nutritional: nutritional,
		status: body.status
	}, function (err, result) {
		if(err) {
			console.log(err);
			logger.error('Error saving productVars record ', { msg:err });
			// assert.equal(err, null);
			return next(err);
		} else {
			logger.debug(ProductVars);
			logger.debug('New productVars record', { tag:'new ProductVars' });
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

productVarsController.edit = (req, res) =>  {
	ProductVars.findOne({_id: req.params.id}).exec(function (err, productVars) {
		if (err) {
			console.log("Error:", err); return;
		} else {
			res.render("../views/productVars/edit.html", {collection: productVars});
		}
	});
};
 
productVarsController.update = (req, res) => {
	const body = req.body;
	const payload = jwt.decode(req.headers.authorization);

	console.log(payload.productVars);

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

	var nutritional = [];
	if (typeof body.calorias !== 'undefined') {
		if (body.calorias instanceof Array) {
			for (var i = 0; i < body.calorias.length; i++) {
				nutritional.push({
					calorias: body.calorias[i],
					proteinas: body.proteinas[i],
					lipidos: body.lipidos[i],
					agsaturados: body.agsaturados[i],
					agmonoinsaturados: body.agmonoinsaturados[i],
					agpoliinsaturados: body.agpoliinsaturados[i],
					omega3: body.omega3[i],
					omega6: body.omega6[i],
					colesterol: body.colesterol[i],
					carbohidratos: body.carbohidratos[i],
					fibra: body.fibra[i],
					agua: body.agua[i],
					calcio: body.calcio[i],
					hierro: body.hierro[i],
					yodo: body.yodo[i],
					magnesio: body.magnesio[i],
					zinc: body.zinc[i],
					sodio: body.sodio[i],
					potasio: body.potasio[i],
					fosforo: body.fosforo[i],
					selenio: body.selenio[i],
					tiamina: body.tiamina[i],
					riboflavina: body.riboflavina[i],
					niacina: body.niacina[i],
					vitamina_b6: body.vitamina_b6[i],
					folatos: body.folatos[i],
					vitamina_b12: body.vitamina_b12[i],
					vitamina_c: body.vitamina_c[i],
					vitamina_a: body.vitamina_a[i],
					vitamina_d: body.vitamina_d[i],
					vitamina_e: body.vitamina_e[i]
				});
			}
		} else {
			nutritional.push({
				calorias: body.calorias,
				proteinas: body.proteinas,
				lipidos: body.lipidos,
				agsaturados: body.agsaturados,
				agmonoinsaturados: body.agmonoinsaturados,
				agpoliinsaturados: body.agpoliinsaturados,
				omega3: body.omega3,
				omega6: body.omega6,
				colesterol: body.colesterol,
				carbohidratos: body.carbohidratos,
				fibra: body.fibra,
				agua: body.agua,
				calcio: body.calcio,
				hierro: body.hierro,
				yodo: body.yodo,
				magnesio: body.magnesio,
				zinc: body.zinc,
				sodio: body.sodio,
				potasio: body.potasio,
				fosforo: body.fosforo,
				selenio: body.selenio,
				tiamina: body.tiamina,
				riboflavina: body.riboflavina,
				niacina: body.niacina,
				vitamina_b6: body.vitamina_b6,
				folatos: body.folatos,
				vitamina_b12: body.vitamina_b12,
				vitamina_c: body.vitamina_c,
				vitamina_a: body.vitamina_a,
				vitamina_d: body.vitamina_d,
				vitamina_e: body.vitamina_e
			});
		}
	}
	onlyNotEmpty['nutritional'] = nutritional;

	ProductVars.findByIdAndUpdate( req.params.id, {
		$push: {
			nutritional
		},
		$set: onlyNotEmpty
	}, { runValidators: true }, function( err, productVars) {
		if( err ) { 
			console.log('Error: ', err); 
			res.render('../views/productVars/edit.html', {collection: body} );
		} else {
			return res.json({ status:'success' });
		}
	});
};

// find by id ProductVars
productVarsController.findEl = function(req, res, next) {
	ProductVars.findById(req.params.id, function(err, data) {
		res.status(200).json({ collection: data });
	}).sort( { createAt: -1 } );
};

productVarsController.getRelated = function(req, res) { 
	console.log('getramales');
	const payload = jwt.decode(req.headers.authorization);
	const parentEl = req.body.relatedEl;
	console.log(req.body);
	console.log(parentEl);
	console.log('payload');

	let response = {};
	console.log(payload.sub);

	ProductVars.find({
		parent : parentEl
	}, (err, data) => {
		res.status(200).json({ collection: data });
	}).sort( { createAt: -1 } );
};

productVarsController.getBy = function(req, res) { 
	const parentEl = req.body.search;
	console.log(req.body);
	console.log(parentEl);

	let response = {};

	ProductVars.find({
		sort: {
			$regex: parentEl
		}
	}, (err, data) => {
		res.status(200).json({ collection: data });
	})
	.limit(20)
	.sort( { createAt: -1 } );
};


// Get all productVars
productVarsController.getList = (req, res, next) => {
	// req.user ==> jwt payload
	ProductVars
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

// Get all productVars populated (with users info)
productVarsController.getPopulated = (req, res, next) => {
	ProductVars
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

// delete ProductVars
productVarsController.delete = function(req, res, next) {
	ProductVars.findById(req.params.id, function(err, ProductVars) {
		if(!ProductVars) {
			var error = new Error('ProductVars not found');
				console.log(error)
					error.status = 404;
			return next(error);
		}
		return ProductVars.remove(function(err) {
			if(err) {
				console.log(err);
				logger.error('Internal error', { err:err });
				return next(err);
			}
			else {
				console.log('delete');
				var deletedProductVars = {
					status: 'success',
					deletedid: req.params.id
				};
				return res.json(deletedProductVars);
			}
		});
	});
};

module.exports = productVarsController;