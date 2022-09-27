	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Products = function () {

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

	this.controller = 'products';

	this.today = new Date();
	this.tomorrow = new Date();
		this.tomorrow.setDate(this.today.getDate()+1);

	this.mm = String(this.today.getMonth()).padStart(2, '0'); //January is 0!
	this.yyyy = this.today.getFullYear();

	this.PrevDate = new Date(this.yyyy, this.mm);
	this.NextDate = new Date(this.yyyy, this.mm);
		this.PrevDate = new Date(this.PrevDate.setDate(this.PrevDate.getDate() - 1)).toISOString();
		this.NextDate = new Date(this.NextDate.setDate(this.NextDate.getDate() + 1)).toISOString();


	this.expTime = new Date(this.today).toISOString();
	this.startTime = new Date(this.today).toISOString();
	this.endTime = new Date(this.tomorrow).toISOString();

	this.init();
};

Products.prototype = {
	init: function () {
		var self = this;
		console.log('products ----- ');

	},
	/**************************************************
	**				Begin Init Controller
	**************************************************/
	initController: function (mode) {
		var self = this;

		// $.each(self.collection, function (i, item) {
		// 	self.generate($('.products' + mode), i, item);
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
	getAll: function (callback) {
		var self = this;

		$.ajax({
			url: "/products/list",
			type:"GET",
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
		}).done(function( data ) {
			console.log(data.collection);
			self.collection = data.collection;
			var key = 'products';
			if (Array.isArray(self.collection) && self.collection.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(self.collection));
				main.functionsObj['products'] = products;
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
			url: '/products/find/' + idEl,
			type:"GET",
			async: false,
			dataType:"json"
		}).done(function( data ) {
			console.log(data.collection);
			var itemProduct = data.collection;
			var key = 'productsID-' + idEl;
			// if (Array.isArray(itemProduct) && itemProduct.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(itemProduct));
				main.functionsObj['products'] = 'products';
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
			url: "/products/related",
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
			var key = 'productsID-' + companyID;
			if (Array.isArray(self.collection) && self.collection.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(self.collection));
				main.functionsObj['products'] = products;
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
	**              Begin Populate
	**************************************************/
	populate: function (stringFilter) {
		var self = this;

		$('.tabLinea.empty').one('click', function() {
			var thisEl = $(this);
			var element = $(this);
			var relatedArgs = [element.data('id')];
			var generateArgs = [
				element.closest('ul').siblings('.tab-content').find('#lineas-' + element.data('id')),
				element.data('id')
			];

			main.checkLocalStorage(
				thisEl,
				products.collection,
				'lineas',
				generateArgs,
				relatedArgs,
				true
			);

			thisEl.removeClass('empty');
		});
	},
	/**************************************************
	**              End Populate
	**************************************************/
	/**************************************************
	**        Start Agregar Variante
	**************************************************/
	addVariant: function (container, inputArr) {
		var self = this;

		container
		.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
			.append($('<div />', { 'class': 'card-pf box border-color' })
				.append($('<div />', { 'class': 'box-header no-padding text-center' })
					.append($('<div />', { 'class': 'box-tools pull-right' })
						.append($('<a />', { 'class': 'btn btn-box-tool btn-delete' })
							.append($('<i />', { 'class': 'fa fa-remove'}))
						)
					)
				)
				.append($('<div />', { 'class': 'box-body no-padding text-center' })
					.append(
						$.map(inputArr, function(mapEl, indexEl) {
							var inputValues = 
								$('<div />', { 'class': 'btn btn-app no-margin fc-grid', 'style': 'height: auto;' })
									.prepend($('<label />', { text: mapEl[1] }))
									.append($('<div />', { 'class': 'input-group' })
										.append($('<span />', { 'class': 'input-group-addon' })
											.prepend($('<i />', { 'class': 'fa ' + mapEl[2] }))
										)
										.append($('<input />', { 'class': 'form-control title', 'placeholder': mapEl[1], 'type': 'text', 'name': 'variant_' + mapEl[0] }))
								);
							var missingFile = $('<div />', { text: 'Falta Archivo' });
							return (typeof mapEl !== 'undefined' && typeof mapEl !== 'undefined') ?
								inputValues
							: missingFile
						})
					)
				)
			)
		)
	},
	/**************************************************
	**        End Agregar Variante
	**************************************************/
	/**************************************************
	**              Begin Generate
	**************************************************/
	generate: function (element, companyID, item) {
		var self = this;
		// var item = lineas.collection.find(selItem => selItem._id === itemID);
		var element = element;
		// Begin Array
		var   imageLength = item.image.length,
		      indexImage = parseInt(item.image.length) - 1,
		      indexImageSub,
		      fileImage = item.image[indexImage];

		if (fileImage instanceof Array && typeof fileImage.filename === 'undefined') {
			indexImageSub = parseInt(fileImage.length) -1;
			fileImage = fileImage[indexImageSub];
		}

		(typeof fileImage !== 'undefined') ? fileImage = '/images/ingredients/' + fileImage.file : fileImage = '/images/ingredients/' + item.titlename + '.jpg';

		element
		// Begin Dropdown Title
		.prepend($('<tr />', { 'class': 'con-tooltip top itemid_' + item._id })
			.append($('<th />', { 'class': 'text-left' })
				.append($('<input />', { 'type': 'checkbox' }))
			)
			.append($('<td />', { 'class': 'relative' })
				.append($('<div />', { 'class': 'btn logo small', 'style': 'background-image: url(' + fileImage + ')' }))
			)
			.append($('<td />', { 'class': 'text-left', text: item.titlename })
				.append($('<div />', { 'class': 'tooltip box' })
					.append($('<div />', { 'class': 'btn logo', 'style': 'display: block; background-image: url(' + fileImage + ')' }))
					.append($('<div />')
						.append($('<h4 />', { 'class': 'capitalize', text: item.titlename }))
						.append($('<p />', { text: item.description }))
					)
				)
			)
			.append($('<td />', { text: '$' + item.cost }))
			.append($('<td />', { text: item.measure }))
			.append($('<td />', { text: item.quantity + item.measure  }))
			.append($('<td />')
				.append($('<div />', { 'class': 'btn-group' })
					.append($('<button />', { 'class': 'btn btn-box-tool dropdown-toggle', 'type': 'button', 'data-toggle': 'dropdown', 'aria-expanded': 'false' })
						.append($('<i />', { 'class': 'fa fa-ellipsis-v' }))
					)
					.append($('<ul />', { 'class': 'dropdown-menu', 'role': 'menu' })
						.append($('<li />')
							.append($('<a />', { 'href': '#', text: 'Eliminar' }))
						)
						.append($('<li />')
							.append($('<a />', { 'href': '#', text: 'Editar' }))
						)
						.append($('<li />')
							.append($('<a />', { 'href': '#', text: 'Alertas' }))
						)
					)
				)
			)
		);
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
		.append($('<form />', { 'class': 'new-product' })
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
			.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
				.append($('<label />', { 'class': 'form-control-label', 'for': 'titlename', text: 'Producto' }))
				.append($('<div />', { 'class': 'input-group titlename', 'id': 'titlename' })
					.append($('<input />', { 'class': 'form-control pull-right required', 'type': 'text', 'data-name': 'titlename', 'name': 'titlename' }))
				)
			)
			.append($('<div />', { 'class': 'col-xs-6 col-sm-6 col-md-6 col-lg-6' })
				.append($('<label />', { 'class': 'form-control-label', 'for': 'category', text: 'Categoria' }))
				.append($('<div />', { 'class': 'input-group category', 'id': 'category' })
					.append($('<input />', { 'class': 'form-control pull-right required', 'type': 'text', 'data-name': 'category', 'name': 'category' }))
				)
			)
			.append($('<div />', { 'class': 'col-xs-6 col-sm-6 col-md-6 col-lg-6' })
				.append($('<label />', { 'class': 'form-control-label', 'for': 'measure', text: 'Medicion' }))
				.append($('<div />', { 'class': 'input-group measure', 'id': 'measure' })
					.append($('<span />', { 'class': 'input-group-addon' })
						.prepend($('<i />', { 'class': 'fa fa-balance-scale' }))
					)
					.append($('<select />', { 'class': 'form-control documentacion capitalize', 'name': 'measure' })
						.append($('<option />', { 'value': 'g', text: 'Gramos' }))
						.append($('<option />', { 'value': 'ml', text: 'Mililitros' }))
					)
				)
			)
			.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
				.append($('<label />', { 'class': 'form-control-label', 'for': 'description', text: 'Descripcion' }))
				.append($('<div />', { 'class': 'input-group description', 'id': 'description' })
					.append($('<textarea />', { 'class': 'form-control pull-right required', 'data-name': 'description', 'name': 'description' }))
				)
			)
			.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
				.append($('<div />', { 'class': 'input-group brand', 'id': 'add-brand' })
					.append($('<input />', { 'class': 'product-brand-btn form-control', 'type': 'button', 'value': 'Agregar Producto' }))
				)
			)
		);

		$(document).on('click', '.new-product .changeAvatar', function() {
			$('#avatar').trigger('click');
		});
		$(document).on('change', '.new-product #avatar', function() {
			main.selectedImage(this, $('.new-product .uploadAvatar img'));
		});
		// $(document).on('change', '#avatar', function() {
		// 	main.selectedImage($('#avatar'), $('.uploadAvatar img'));
		// });

		$('.product-brand-btn').on('click', function(){
			main.uploadAvatar($('#avatar'), 'avatar');
			(typeof addnew === 'undefined') ? window['addnew'] = [] : '';
			addnew.product = $('form.new-product').serializeArray();
			addnew.productobj = [];
			addnew.productobj.push({
				id: 'new-brand',
				titlename: $('form.new-product .titlename input').val(),
				category: $('form.new-product .category input').val(),
				measure: $('form.new-product .measure input').val(),
				description: $('form.new-product .description input').val(),
				avatar: [{
					file: $('form.new-product .uploadedAvatar .file').val()
				}]
			});
			$('form.new-product').remove();
			$(document).off('click', '.new-product .changeAvatar');
			$(document).off('change', '.new-product #avatar');
			self.addItem($('#select-product ul'), addnew.productobj[(addnew.productobj.length -1)]);
			productVariant.itemForm($('#select-variant ul'));
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
		.append($('<li />', { 'class': 'product', 'data-id': item._id })
			.append($('<div />', { 'class': 'result' })
				.append($('<img />', { 'class': 'pull-left img-circle thumb', 'src': brandavatar }))
				.append($('<div />', { 'class': 'title', text: item.titlename }))
					.append($('<div />', { 'class': 'description' })
						.append($('<span />', { text: item.category }))
					)
			)
		);
	}
	/**************************************************
	**              End Generate
	**************************************************/
};

// document.addEventListener("deviceready", onDeviceReady, false);

var products = new Products();
