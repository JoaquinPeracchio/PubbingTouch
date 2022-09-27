	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Ingredients = function () {

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

	this.controller = 'ingredients';

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

Ingredients.prototype = {
	init: function () {
		var self = this;
		console.log('ingredientes ----- ');

	},
	/**************************************************
	**				Begin Init Controller
	**************************************************/
	initController: function (mode) {
		var self = this;

		// $.each(self.collection, function (i, item) {
		// 	self.generate($('.ingredients' + mode), i, item);
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
	getRelated: function (companyID, callback) {
		var self = this;
		// var element = element;

		$.ajax({
			url: "/ingredients/related",
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
			var key = 'ingredients-' + companyID;
			if (Array.isArray(self.collection) && self.collection.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(self.collection));
				main.functionsObj['ingredients'] = ingredients;
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
				ingredients.collection,
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
	**              Begin Generate
	**************************************************/
	generate: function (element, companyID, item) {
		var self = this;
		// var item = lineas.collection.find(selItem => selItem._id === itemID);
		var element = element;
		// Begin Array
		var   avatarLength = item.avatar.length,
		      indexAvatar = parseInt(item.avatar.length) - 1,
		      indexAvatarSub,
		      fileAvatar = item.avatar[indexAvatar];

		if (fileAvatar instanceof Array && typeof fileAvatar.filename === 'undefined') {
			indexAvatarSub = parseInt(fileAvatar.length) -1;
			fileAvatar = fileAvatar[indexAvatarSub];
		}

		(typeof fileAvatar !== 'undefined') ? fileAvatar = '/uploads/' + fileAvatar.file : fileAvatar = '/images/ingredients/' + item.titlename + '.jpg';

		element
		// Begin Dropdown Title
		.prepend($('<tr />', { 'class': 'con-tooltip top itemid_' + item._id })
			.append($('<th />', { 'class': 'text-left' })
				.append($('<input />', { 'type': 'checkbox' }))
			)
			.append($('<td />', { 'class': 'relative' })
				.append($('<div />', { 'class': 'btn logo small', 'style': 'background-image: url(' + fileAvatar + ')' }))
			)
			.append($('<td />', { 'class': 'text-left', text: item.titlename })
				.append($('<div />', { 'class': 'tooltip box' })
					.append($('<div />', { 'class': 'btn logo', 'style': 'display: block; background-image: url(' + fileAvatar + ')' }))
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
	**              End Generate
	**************************************************/
	/**************************************************
	**              Begin append Stock
	**************************************************/
	appendStock: function (element, productItem, currProduct, itemVars) {
		var self = this;

		element.append($('<li />', { 'class': 'item-product relative border-bottom', 'data-id': productItem._id, 'data-sku': currProduct.sku })
			.append($('<div />', { 'class': 'col-xs-1 col-sm-1 col-md-1 col-lg-1 no-padding' })
				.append($('<img />', { 'class': 'img-circle', 'src': currProduct.image, 'style': 'width: 100% !important;', 'alt': 'Imagen de Producto' }))
			)
			.append($('<div />', { 'class': 'col-xs-11 col-sm-11 col-md-11 col-lg-11' })
				.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
					.append($('<div />', { 'class': 'input-group item-match', 'data-id': productItem._id })
						.append($('<span />', { 'title': 'Codigo', 'class': 'input-group-addon barcode copyEl', 'data-value' : currProduct.barcode })
							.append($('<i />', { 'class': 'fa fa-barcode' }))
						)
						.append($('<span />', { 'title': 'Empresa', 'class': 'input-group-addon brand copyEl', 'data-value': productItem.brand })
							.append($('<i />', { 'class': 'fa fa-registered' }))
						)
						.append($('<span />', { 'title': 'Producto', 'class': 'input-group-addon titlename copyEl', 'data-value': currProduct.titlename })
							.append($('<i />', { 'class': 'fa fa-shopping-basket' }))
						)
						.append($('<div />', { 'title': productItem.brand + ' ' + currProduct.titlename, 'class': 'value form-control pull-right', text: productItem.brand + ' ' + currProduct.titlename })
						)
					)
				)
				.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
					.append($('<div />', { 'class': 'input-group' })
						.append($('<span />', { 'title': 'Contenido Neto', 'class': 'input-group-addon item-content copyEl', 'data-value' : currProduct.item_content })
							.append($('<i />', { 'class': 'fa fa-balance-scale' }))
						)
						.append($('<div />', { 'title': currProduct.item_content, 'class': 'value form-control pull-right', text: currProduct.item_content })
						)
						.append($('<span />', { 'title': 'Costo', 'class': 'input-group-addon cost', 'data-value': itemVars.last_buy })
							.append($('<i />', { 'class': 'fa fa-money' }))
						)
						.append($('<div />', { 'title': itemVars.last_buy, 'class': 'value form-control pull-right', text: itemVars.last_buy })
						)
						.append($('<span />', { 'title': 'Precio', 'class': 'input-group-addon price', 'data-value': itemVars.price })
							.append($('<i />', { 'class': 'fa fa-dollar' }))
						)
						.append($('<div />', { 'title': itemVars.price, 'class': 'value form-control pull-right', text: itemVars.price })
						)
						.append($('<span />', { 'title': 'Stock', 'class': 'input-group-addon stock', 'data-value': itemVars.stock })
							.append($('<i />', { 'class': 'fa fa-bar-chart' }))
						)
						.append($('<div />', { 'title': itemVars.stock, 'class': 'value form-control pull-right', text: itemVars.stock })
						)
						.append($('<span />', { 'title': 'Stock Minimo', 'class': 'input-group-addon stock-min', 'data-value': itemVars.stock_alert })
							.append($('<i />', { 'class': 'fa fa-bell' }))
						)
						.append($('<div />', { 'title': itemVars.stock_alert, 'class': 'value form-control pull-right', text: itemVars.stock_alert })
						)
					)
				)
			)
			.append($('<div />', { 'class': 'absolute top-right' })
				.append($('<div />', { 'class': 'btn-group' })
					.append($('<button />', { 'type': 'button', 'class': 'btn btn-box-tool dropdown-toggle', 'data-toggle': 'dropdown', 'aria-expanded': 'false' })
						.append($('<i />', { 'class': 'fa fa-ellipsis-v' }))
					)
					.append($('<ul />', { 'class': 'dropdown-menu', 'role': 'menu' })
						.append($('<li />')
							.append($('<a />', { 'href': '#', text: 'Eliminar' }))
							.append($('<a />', { 'href': '#', text: 'Editar' }))
							.append($('<a />', { 'href': '#', text: 'Alertas' }))
						)
					)
				)
			)
			.append($('<hr />', { 'class': 'clear' }))
		)
	},
	/**************************************************
	**              End Append stock
	**************************************************/
	/**************************************************
	**              Begin add Stock
	**************************************************/
	addStock: function (element, currProduct, skuIndex) {
		var self = this;

		element.append($('<li />', { 'class': 'sku-item', 'data-sku': currProduct.variant[skuIndex].sku })
			.append($('<div />', { 'class': 'col-xs-1 col-sm-1 col-md-1 col-lg-1 no-padding' })
				.append($('<img />', { 'class': 'img-circle', 'src': currProduct.variant[skuIndex].image, 'style': 'width: 100% !important;', 'alt': 'Imagen de Producto' }))
			)

			.append($('<div />', { 'class': 'col-xs-11 col-sm-11 col-md-11 col-lg-11' })
				.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
					.append($('<div />', { 'class': 'input-group item-match', 'data-id': currProduct._id })
						.append($('<span />', { 'title': 'Codigo', 'class': 'input-group-addon barcode copyEl', 'data-value' : currProduct.variant[skuIndex].barcode })
							.append($('<i />', { 'class': 'fa fa-barcode' }))
						)
						.append($('<span />', { 'title': 'Empresa', 'class': 'input-group-addon brand copyEl', 'data-value': currProduct.brand })
							.append($('<i />', { 'class': 'fa fa-registered' }))
						)
						.append($('<span />', { 'title': 'Producto', 'class': 'input-group-addon titlename copyEl', 'data-value': currProduct.variant[skuIndex].titlename })
							.append($('<i />', { 'class': 'fa fa-shopping-basket' }))
						)
						.append($('<div />', { 'title': currProduct.brand + ' ' + currProduct.variant[skuIndex].titlename, 'class': 'value form-control pull-right', text: currProduct.brand + ' ' + currProduct.variant[skuIndex].titlename })
						)
					)
				)
				.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
					.append($('<div />', { 'class': 'input-group' })
						.append($('<span />', { 'title': 'Contenido Neto', 'class': 'input-group-addon item-content copyEl', 'data-value' : currProduct.variant[skuIndex].item_content })
							.append($('<i />', { 'class': 'fa fa-balance-scale' }))
						)
						.append($('<div />', { 'title': currProduct.variant[skuIndex].item_content, 'class': 'value form-control pull-right', text: currProduct.variant[skuIndex].item_content })
						)
						.append($('<span />', { 'title': 'Costo', 'class': 'input-group-addon cost' })
							.append($('<i />', { 'class': 'fa fa-money' }))
						)
						.append($('<input />', { 'type': 'number', 'min': 0, 'step': '1.00', 'name': 'variant_last_buy', 'class': 'form-control pull-right required last_buy' }))
						.append($('<span />', { 'title': 'Precio', 'class': 'input-group-addon price' })
							.append($('<i />', { 'class': 'fa fa-dollar' }))
						)
						.append($('<input />', { 'type': 'number', 'min': 0, 'step': '1.00', 'name': 'variant_price', 'class': 'form-control pull-right required price' }))
						.append($('<span />', { 'title': 'Stock', 'class': 'input-group-addon stock' })
							.append($('<i />', { 'class': 'fa fa-bar-chart' }))
						)
						.append($('<input />', { 'type': 'number', 'min': 0, 'step': '1.00', 'name': 'variant_stock', 'class': 'form-control pull-right required stock' }))
						.append($('<span />', { 'title': 'Stock Minimo', 'class': 'input-group-addon stock-min' })
							.append($('<i />', { 'class': 'fa fa-bell' }))
						)
						.append($('<input />', { 'type': 'number', 'min': 0, 'step': '1.00', 'name': 'variant_stock_alert', 'class': 'form-control pull-right required stock_alert' }))
					)
				)
			)
		)
		.append($('<hr />', { 'class': 'clear' }))
	}
	/**************************************************
	**              End add Stock
	**************************************************/
};

// document.addEventListener("deviceready", onDeviceReady, false);

var ingredients = new Ingredients();
