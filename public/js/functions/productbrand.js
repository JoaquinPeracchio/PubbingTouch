	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var ProductBrand = function () {

	/**************************************************
					Begin Selectors
	**************************************************/


	// Body
	this.$body = $('body');
	// Loader
	this.$loader = $('#loader');

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.mode = this.$body.data('mode');

	this.access_token = window.localStorage.getItem('access_token');

	this.controller = 'productbrand';

	this.init();
};

ProductBrand.prototype = {
	init: function () {
		var self = this;
		console.log('productbrand ----- ');

	},
	/**************************************************
	**				Begin Init Controller
	**************************************************/
	initController: function (mode) {
		var self = this;

		// $.each(self.collection, function (i, item) {
		// 	self.generate($('.productbrand' + mode), i, item);
		// });
		self.populate();
		main.overlay.hide();
	},
	/**************************************************
	**				End Init Controller
	**************************************************/
	/**************************************************
	** 			Begin Get Related Document
	**************************************************/
	register: function (formData, callback) {
		var self = this;

		$.ajax({
			url: "/brand/register",
			type:"POST",
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: formData,
		}).done(function( data ) {
			console.log(data.collection);
			self.collection = data.collection;
			var key = 'productbrand';
			if (Array.isArray(self.collection) && self.collection.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(self.collection));
				main.functionsObj['productbrand'] = productbrand;
			}
			(typeof callback !== 'undefined') ? callback(self.collection) : '';
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
			(typeof callback !== 'undefined') ? callback(self.collection) : '';
		});
	},
	/**************************************************
	** 			End Get Related Document
	**************************************************/
	/**************************************************
	** 			Begin Get Related Document
	**************************************************/
	getAll: function (callback) {
		var self = this;

		$.ajax({
			url: "/productbrand/list",
			type:"GET",
			dataType:"json",
		}).done(function( data ) {
			console.log(data.collection);
			self.collection = data.collection;
			var key = 'productbrand';
			if (Array.isArray(self.collection) && self.collection.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(self.collection));
				main.functionsObj['productbrand'] = productbrand;
			}
			(typeof callback !== 'undefined') ? callback(self.collection) : '';
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
			(typeof callback !== 'undefined') ? callback(self.collection) : '';
		});
	},
	/**************************************************
	** 			End Get Related Document
	**************************************************/
	/**************************************************
	**        Start Get by ID
	**************************************************/
	getById: function (idEl, callback) {
		var self = this;
		// var element = element;

		$.ajax({
			url: '/productbrand/find/' + idEl,
			type:"GET",
			async: false,
			dataType:"json"
		}).done(function( data ) {
			console.log(data.collection);
			var itemProduct = data.collection;
			var key = 'productbrandID-' + idEl;
			// if (Array.isArray(itemProduct) && itemProduct.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(itemProduct));
				main.functionsObj['productbrand'] = 'productbrand';
			// }
			(typeof callback !== 'undefined') ? callback(itemProduct) : '';
			// var index = company.collection.findIndex(compEl => compEl._id === idEl);
			// console.log(index);
			// company.collection[index] = Object.assign({'lineas': itemProduct}, company.collection[index])
			// self.generate(element, index, idEl, directAppend);
			// $('.menu .item').tab();
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
			(typeof callback !== 'undefined') ? callback(itemProduct) : '';
		});
	},
	/**************************************************
	**        End Get by ID
	**************************************************/
	/**************************************************
	** 			Begin Get Related Document
	**************************************************/
	getRelated: function (companyID, callback) {
		var self = this;
		// var element = element;

		$.ajax({
			url: "/productbrand/related",
			type:"POST",
			async: false,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: {
				parent: companyID
			}
		}).done(function( data ) {
			console.log(data.collection);
			self.collection = data.collection;
			var key = 'productbrandID-' + companyID;
			if (Array.isArray(self.collection) && self.collection.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(self.collection));
				main.functionsObj['productbrand'] = productbrand;
			}
			(typeof callback !== 'undefined') ? callback(self.collection) : '';
			// var index = company.collection.findIndex(compEl => compEl._id === companyID);
			// console.log(index);
			// company.collection[index] = Object.assign({'lineas': self.collection}, company.collection[index])
			// self.generate(element, index, companyID, directAppend);
			// $('.menu .item').tab();
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
			(typeof callback !== 'undefined') ? callback(self.collection) : '';
		});
	},
	/**************************************************
	** 			End Get Related Document
	**************************************************/
	/**************************************************
	**        Start Agregar Variante
	**************************************************/
	itemForm: function (container, callback) {
		var self = this;

		container
		.append($('<form />', { 'class': 'productbrand' })
			.append($('<div />', { 'class': 'uploadAvatar user-panel align-center' })
				.append($('<div />', { 'class': 'changeAvatar' })
					.append($('<img />', { 'class': 'img-circle', 'src': '/images/missing-image.jpg', 'style': 'width: 15vw !important; height: 15vw !important;', 'alt': 'Imagen Marca' }))
					.append($('<div />', { 'class': 'text-center' })
						.prepend($('<i />', { 'class': 'fa fa-camera' }))
						.append($('<p />', { text: 'Agregar' }))
					)
				)
			)
			.append($('<div />', { 'class': 'uploadedAvatar hidden' })
				.append($('<label />', { 'class': 'form-control-label', 'for': 'avatar', text: 'Logo' }))
				.append($('<div />', { 'class': 'input-group' })
					.append($('<input />', { 'class': 'avatar', 'type': 'file', 'id': 'avatar' , 'data-name': 'avatar', 'name': 'avatar' }))
				)
			)
			.append($('<div />', { 'class': 'col-xs-6 col-sm-6 col-md-6 col-lg-6' })
				.append($('<label />', { 'class': 'form-control-label', 'for': 'titlename', text: 'Marca' }))
				.append($('<div />', { 'class': 'input-group titlename', 'id': 'titlename' })
					.append($('<input />', { 'class': 'form-control pull-right required', 'type': 'text', 'data-name': 'titlename', 'name': 'titlename' }))
				)
			)
			.append($('<div />', { 'class': 'col-xs-6 col-sm-6 col-md-6 col-lg-6' })
				.append($('<label />', { 'class': 'form-control-label', 'for': 'slogan', text: 'Slogan' }))
				.append($('<div />', { 'class': 'input-group slogan', 'id': 'slogan' })
					.append($('<input />', { 'class': 'form-control pull-right required', 'type': 'text', 'data-name': 'slogan', 'name': 'slogan' }))
				)
			)
			.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
				.append($('<div />', { 'class': 'input-group brand', 'id': 'add-brand' })
					.append($('<input />', { 'class': 'product-brand-btn form-control', 'type': 'button', 'value': 'Agregar Marca' }))
				)
			)
		);

		$(document).on('click', '.productbrand .changeAvatar', function() {
			$('#avatar').trigger('click');
		});
		$(document).on('change', '.productbrand #avatar', function() {
			main.selectedImage(this, $('.productbrand .uploadAvatar img'));
		});
		// $(document).on('change', '#avatar', function() {
		// 	main.selectedImage($('#avatar'), $('.uploadAvatar img'));
		// });

		$('.product-brand-btn').on('click', function(){
			main.uploadAvatar($('#avatar'), 'avatar');
			window['addnew'] = [];
			addnew.brand = $('form.productbrand').serializeArray();
			addnew.brandobj = {
				id: 'new-brand',
				titlename: $('form.productbrand .titlename input').val(),
				slogan: $('form.productbrand .slogan input').val(),
				avatar: [{
					file: $('form.productbrand .uploadedAvatar .file').val()
				}]
			};
			$('form.productbrand').remove();
			$(document).off('click', '.productbrand .changeAvatar');
			$(document).off('change', '.productbrand #avatar');
			self.addItem($('#search-brand ul'), addnew.brandobj);
			products.itemForm($('#select-product ul'));
		});
	},
	/**************************************************
	** 			End Get Related Document
	**************************************************/
	/**************************************************
	**        Start Agregar Variante
	**************************************************/
	addItem: function (container, item, callback) {
		var self = this;
		var brandavatar = '/images/missing-image.jpg';
		(typeof item.avatar !== 'undefined') ? brandavatar = '/uploads/' + item.avatar[0].file : '';

		container
		.append($('<li />', { 'class': 'brand', 'data-id': item._id })
			.append($('<div />', { 'class': 'result' })
				.append($('<img />', { 'class': 'pull-left img-circle thumb', 'src': brandavatar }))
				.append($('<div />', { 'class': 'title', text: item.titlename }))
					.append($('<div />', { 'class': 'description' })
						.append($('<span />', { text: item.slogan }))
					)
			)
		);
	}
	/**************************************************
	**        End Agregar Variante
	**************************************************/
};

// document.addEventListener("deviceready", onDeviceReady, false);

var productbrand = new ProductBrand();
