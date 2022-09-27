'use strict';

const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const jwt      = require('jsonwebtoken');
const logger = require('../helpers/logger');
const authMiddleware = require('../middlewares/auth');
const _ = require('lodash');

var categoryController = {};

// register user category
categoryController.register = (req, res, next) => {
	const body = req.body;

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

	let category = new Category();
	Category.create({
		createAt: Date.now(),
		user_id: req.user.sub,
		avatar: avatar,
		titlename: body.titlename,
		description: body.description,
		parent: body.parent,
		slug: body.slug,
		type: body.type,
		status: body.status
	}, function (err, result) {
		if(err) {
			console.log(err);
			logger.error('Error saving category record ', { msg:err });
			// assert.equal(err, null);
			return next(err);
		} else {
			logger.debug(Category);
			logger.debug('New category record', { tag:'new Category' });
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

categoryController.edit = (req, res) =>  {
	Category.findOne({_id: req.params.id}).exec(function (err, category) {
		if (err) {
			console.log("Error:", err); return;
		} else {
			res.render("../views/category/edit.html", {collection: category});
		}
	});
};
 
categoryController.update = (req, res) => {
	const body = req.body;
	const payload = jwt.decode(req.headers.authorization);

	console.log(payload.category);

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

	Category.findByIdAndUpdate( req.params.id, {
		$set: onlyNotEmpty
	}, { runValidators: true }, function( err, category) {
		if( err ) { 
			console.log('Error: ', err); 
			res.render('../views/category/edit.html', {collection: body} );
		} else {
			return res.json({ status:'success' });
		}
	});
};

categoryController.getRelated = function(req, res) { 
	const payload = jwt.decode(req.headers.authorization);
	const parentEl = req.body.parent;

	let response = {};

	Category.find({
		parent : parentEl
	}, (err, data) => {
		res.status(200).json({ collection: data });
	}).sort( { createAt: -1 } );
};

// Get all category
categoryController.getList = (req, res, next) => {
	// req.user ==> jwt payload
	Category
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

// Get all category populated (with users info)
categoryController.getPopulated = (req, res, next) => {
	Category
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

// delete Category
categoryController.delete = function(req, res, next) {
	Category.findById(req.params.id, function(err, Category) {
		if(!Category) {
			var error = new Error('Category not found');
				console.log(error)
					error.status = 404;
			return next(error);
		}
		return Category.remove(function(err) {
			if(err) {
				console.log(err);
				logger.error('Internal error', { err:err });
				return next(err);
			}
			else {
				console.log('delete');
				var deletedCategory = {
					status: 'success',
					deletedid: req.params.id
				};
				return res.json(deletedCategory);
			}
		});
	});
};

module.exports = categoryController;