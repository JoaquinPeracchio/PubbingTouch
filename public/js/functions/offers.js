	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Offers = function () {

	/**************************************************
					Begin Selectors
	**************************************************/


	// Body
	this.$body = $('body');
	// Loader
	this.$loader = $('#loader');

	this.$content = $('.content');
	// Offers Page
		this.$form = this.$content.find("#offersForm");
			this.$offersFilter = this.$content.find('.offersFilter');
				this.$offersSortSelect = this.$offersFilter.find('select');
				this.$offersSortBy = this.$offersFilter.find('.sortBy');
				this.$offersSortOrder = this.$offersFilter.find('.sortOrder');
				this.$offersFilterString = this.$offersFilter.find('.stringFilter');
			this.$offersList = this.$content.find('.offerslist');

			this.$companies = this.$form.find('#parent');

			this.$searchItems = this.$form.find('#searchItems');

	this.$btnDelete;
	this.$deleteParque;

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.mode = this.$body.data('mode');

	this.access_token = window.localStorage.getItem('access_token');

	this.controller = 'offers';
	this.parent;
	this.offersCollection;
	this.offersList

	this.documents = {};
	this.documents['filetypes'] = [
		'autorizacion',
		'renovacion'
	];

	this.ingredientes = [];

	this.init();
};

Offers.prototype = {
	init: function () {
		var self = this;

		self.formSteps();

		// self.getRelated();
		// self.bindEvents();
		// self.getUsers();
		// self.userSearch();
		// (self.mode == 'list') ? self.list() : '';
		// self.submit();
	},
	/**************************************************
	/**************************************************
	**              Users List
	**************************************************/
	defineVars: function (callback) {
		var self = this;

		self.$searchItems = self.$form.find('#searchItems');
	},
	/**************************************************
	/**************************************************
	**              Users List
	**************************************************/
	formSteps: function (callback) {
		var self = this;

		self.$form.steps({
			headerTag: "h3",
			// iconTag: "icon",
			bodyTag: "fieldset",
			transitionEffect: "slideLeft",
			onInit: function (event, currentIndex, newIndex) {
				self.defineVars();
				self.appendCompanies();
				self.bindEvents();
				main.fileOptions(true, this.documents);
				self.daterange();
				$('#servDesc').hide();
				//$('.form-control-label').hide();

				main.overlay.hide();
			},
			onStepChanging: function (event, currentIndex, newIndex) {
				// Allways allow previous action even if the current form is not valid!
				if (currentIndex > newIndex) {
					return true;
				}
				// Forbid next action on "Warning" step if the user is to young
				if (newIndex === 3 && Number($("#age-2").val()) < 18) {
					return false;
				}
				// Needed in some cases if the user went back (clean up)
				if (currentIndex < newIndex) {
					// To remove error styles
					form.find(".body:eq(" + newIndex + ") label.error").remove();
					form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
				}
				form.validate().settings.ignore = ":disabled,:hidden";
				return form.valid();
			},
			onStepChanged: function (event, currentIndex, priorIndex) {
				// Used to skip the "Warning" step if the user is old enough.
				if (currentIndex === 2 && Number($("#age-2").val()) >= 18) {
					form.steps("next");
				}
				// Used to skip the "Warning" step if the user is old enough and wants to the previous step.
				if (currentIndex === 2 && priorIndex === 3) {
					form.steps("previous");
				}
			},
			onFinishing: function (event, currentIndex) {
				form.validate().settings.ignore = ":disabled";
				return form.valid();
			},
			onFinished: function (e, currentIndex) {
				console.log("Submitted!");
				e.preventDefault();

				main.uploadAvatar($('#avatar'), 'avatar');
				main.uploadFile($('#files'), 'files');

				var serializedArr = $('form').serializeArray();
				var parent = $('#parent').val();
				var company = $('#company').val();
				var collection = 'offers';
				var mode = 'register';

				main.submit(collection, mode, serializedArr, function (data) {
					console.log(data)
					// socketio.sendNodeNotification(
					// 	parent,
					// 	'Linea Creada',
					// 	data.result.comment || '',
					// 	'/uploads/' + data.result.avatar || '',
					// 	data.result.parent,
					// 	collection || '',
					// 	data.result._id || ''
					// );
					main.overlay.fadeOut();
					window.location.href = '/offers';
				});

			}
		}).validate({
			errorElement: 'span',
			// errorClass: 'has-error',
			// errorPlacement: function errorPlacement(error, element) { element.after(error); },
			errorPlacement: function errorPlacement(error, element) {
				element.parent().parent().addClass('has-error');
				element.parent().parent().find('label').append(error);
			},
			// messages: {
			// 	'join[email]': "Please enter a valid email address.",
			// 	'firstName': "Please enter a valid first name.",
			// 	'lastName': "Please enter a valid last name."
			// }
			rules: {
				percent: {
					required: true,
					range: [0, 100]
				}
				// confirm: {
				//     equalTo: "#password-2"
				// }
			}
		});
	},
	/**************************************************
	**              Append Companies
	**************************************************/
	appendCompanies: function (callback) {
		var self = this;

		company.getRelated(function(data){
			companyCollection = data.collection;
			companyList = Array.from(data.collection);
			$.each(data.collection, function (i, item) {
				main.getStock(item, self.ingredientes, function(productInfo, currProduct, itemVars, stockCollection){
					console.log(productInfo, currProduct, itemVars, stockCollection);
				});
				self.$companies.append($('<option />', { 'class': 'id_' + item._id, 'value': item._id, text: main.toFUppercase(item.titlename) }))
				// main.getNotification(item);
			});
			var config = {
				'.chosen-select' : { no_results_text: 'No se encontro:' }
			}
			for (var selector in config) {
				$(selector).chosen(config[selector]);
			}
		});
	},
	/**************************************************
	**              Bind Events
	**************************************************/
	bindEvents: function (callback) {
		var self = this;

		$(document).on('click', '.changeAvatar', function() {
			$('#avatar').trigger('click');
		});
		$('#avatar').on('change', function() {
			main.selectedImage(this, $('.uploadAvatar img'));
		});
		$(document).on('change', '#parent', function(){
			$('#parent option[value=' + $(this).val() +']').attr('selected', 'selected')
		});
		$(document).on('change', '#type', function(){
			$('#type option[value=' + $(this).val() +']').attr('selected', 'selected')
		});
		self.$searchItems.on('keypress',function(e) {
		    if(e.which == 13) {
				$(document).stocklistSidebar('open');
		    }
		});
		$(document).on('focusin', '#searchItems', function(){
			$(document).stocklistSidebar('open');
		});
		$(document).on('focusout', '#searchItems', function(){
			$(document).stocklistSidebar('close');
		});

		$(document).on('input', self.$searchItems, function(){
			self.autocomplete('sort', self.$searchItems.val());
		});

		$('#sizeDimensions').on('click', function() {
			if($(this).val() === 'services'){
				self.$searchItems.hide();
				$('.comp').hide();
				$('.filter').hide();
				$('#servDesc').show();
				$('#agreeServ').show();
			}
		});
		$('#sizeWeight').on('click', function() {
			if($(this).val() === 'product'){
				self.$searchItems.show();
				$('.comp').show();
				$('.filter').show();
				$('#servDesc').hide();
				$('#agreeServ').hide();
			}
		});

		$(document).on('click', '.stocklist-sidebar ul .predictive', function(e){
			console.log($(this));
			var selectedProdId = $(this).data('id');
			var selectedProdSku = $(this).data('sku');
			var currProduct = JSON.parse(window.localStorage.getItem('productsID-' + selectedProdId));
			var skuIndex = main.getIndexParam(currProduct.variant, 'sku', selectedProdSku);
			if (typeof $('.newFiles .cardProduct[data-sku="' + selectedProdSku + '"]').data('sku') !== 'undefined'){
				let quantity = parseInt($('.newFiles .cardProduct[data-sku="' + selectedProdSku + '"] .quantity').val()) +1;
				$('.cardProduct[data-sku=' + selectedProdSku + '] .quantity').val(parseInt(quantity));
				$('.buyPrice').text($('.buyPrice').data('buy') * quantity);
				$('.sellPrice').text($('.sellPrice').data('sell') * quantity);
			} else {
				main.cardProduct($('.newFiles'), currProduct, skuIndex);
			}
			
			$(document).stocklistSidebar('close');
		});

		$(document).on('click', '.btn-up', function(){
			card = $(this).closest('.card');
		    this.parentNode.querySelector('input[type=number]').stepUp();
		    card.find('.quantity').trigger('change');
		})
		$(document).on('click', '.btn-down', function(){
			card = $(this).closest('.card');
		    this.parentNode.querySelector('input[type=number]').stepDown();
		    card.find('.quantity').trigger('change');
		})

		$(document).on('change', '.cardProduct .quantity', function() {

			let quantity = $(this).val();
			let card = $(this).closest('.card');
			let sellPrice = card.find('.sellPrice');
			let buyPrice = card.find('.buyPrice');
			buyPrice.text(buyPrice.data('buy') * quantity);
			sellPrice.text(sellPrice.data('sell') * quantity);
		})

		$(document).on('click','.card-button',function(){
			let card = $(this).closest('.cardProduct');
			card.remove();
		})

	},
	/**************************************************
	**              Users List
	**************************************************/
	autocomplete: function (sortBy, searchBar) {
		var self = this;

		var charLength = searchBar.length,
			filterFlag = true;

		(searchBar !== '') ? $('#productList li').hide() : $('#productList li').show();

		if (searchBar.match(/^\d+$/) != null) {
			sortBy = 'barcode';
		}

		if (searchBar.length >= 2) {
			main.autocomplete(
				self.$searchItems,
				self.ingredientes,
				$('.stocklist-sidebar ul'),
				sortBy,
				10,
				function(element, item, sortBy, globalItem) {
					// console.log($('#productList li .' + sortBy).find("[data-value='" + matchedValue + "']"));
					// $('#productList li .' + sortBy + '[data-value="' + matchedValue + '"]').closest('li').show();
					if (typeof $('.stocklist-sidebar ul li.predictive[data-sku="' + item.sku + '"]').data('id') !== 'undefined') {
						$('.stocklist-sidebar ul li.predictive[data-sku="' + item.sku + '"]').show();
					} else if (typeof $('.stocklist-sidebar ul li.predictive[data-sku="' + item.sku + '"]').data('id') === 'undefined') {
						element.append($('<li />', { 'class': 'predictive', 'data-id': globalItem._id, 'data-sku': item.sku })
							.append($('<div />', { 'class': 'comp', text: globalItem.category }))
							.append($('<div />', { 'class': 'user' })
								.append($('<div />', { 'class': 'result' })
									.append($('<img />', { 'class': 'pull-left img-circle thumb', 'src': item.image }))
									.append($('<div />', { 'class': 'title', text: item.titlename + ' - ' + item.item_content }))
										.append($('<div />', { 'class': 'description' })
											.append($('<span />', { text: 'Marca: ' + globalItem.brand + ' - ' }))
										)
								)
							)
						);
					}
				}, function (content, item, filterCont) {
				}, function (element, count){
					if (count == 0) {
						$('#productList li').hide();
						$('.stocklist-sidebar ul').empty().show();
						$('.new-item .only-new').show();
						$('.new-item .not-new').hide();
						element
					} else {
						$('.new-item .only-new').hide();
						$('.new-item .not-new').show();
						element.show();
					}
				}
			);
			$('.stocklist-sidebar ul').append($('<li />', { 'class': 'btn searchItem', 'type': 'button' })
				.append($('<div />', { 'class': 'comp', text: 'Buscar' }))
				.append($('<div />', { 'class': 'user' })
					.append($('<div />', { 'class': 'result' })
						.append($('<div />', { 'class': 'title text-left', text: 'Buscar Producto' }))
					)
				)
			)
		} else {
			$('#productList li').show();
			$('.stocklist-sidebar ul').empty();
		}
	},
	/**************************************************
	**              Users List
	**************************************************/
	daterange: function (callback) {
		var self = this;

		$('#daterange').daterangepicker({
			"linkedCalendars": false,
			"showCustomRangeLabel": false,
		}, function(start, end, label) {
			console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
			$('#startdate').val(new Date(start).toISOString());
			$('#enddate').val(new Date(end).toISOString());
		});
	},
	/**************************************************
	**              Users List
	**************************************************/
	getAll: function (callback) {
		var self = this;

		// self.$offersList.empty();

		$.ajax({
			// url: "/offers/offersinfo",
			url: "/offers/list",
			type:"GET",
			async: true,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
		}).done(function( data ) {
			console.log(data);
			self.collection = data.collection;
			window.localStorage.setItem('offers', JSON.stringify(self.collection));
			main.functionsObj['offers'] = offers;
			callback(data);
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			callback('fail');
		});

	},
	/**************************************************
	**              End Users List
	**************************************************/
	/**************************************************
	**              offers List
	**************************************************/
	getRelated: function (callback) {
		var self = this;

		// self.$offersList.empty();

		$.ajax({
			// url: "/offers/offersinfo",
			url: "/" + self.controller + "/related",
			type:"GET",
			async: true,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
		}).done(function( data ) {
			console.log(data);
			self.collection = data.collection;
			window.localStorage.setItem('offers', JSON.stringify(self.collection));
			main.functionsObj['offers'] = offers;
			callback(data);
			// if (self.collection.length != 0) {
			// 	$.each(self.collection, function (i, item) {
			// 		self.getLineas(self.collection[i]._id, i);
			// 	});
			// 	main.sortProperties(data.offers, self.$offersSortBy.val(), self.$offersSortOrder.val());
			// (populate) ? self.populate() : '';
			// }
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			callback('fail');
		});

	},
	/**************************************************
	**              End offers List
	**************************************************/
	/**************************************************
	**        Begin Generate Parque
	**************************************************/
	// generateTabs: function (element, offersID) {
	// 	var self = this;

	// 	element.append(
	// 	$('<div />', { 'class': 'box-body align-center' })
	// 		.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/offers/register', text: 'Agregar Categoria' }))
	// 	)
	// },
	/**************************************************
	**        End get Parques
	**************************************************/
	/**************************************************
	**              Populate Companies
	**************************************************/
	populate: function (stringFilter) {
		var self = this;

		// self.$offersList.empty();
		if (self.offersFilterFlag) {
			$.each(self.collection, function (i, item) {
				if (String(item[self.$offersSortBy.val()]).toLowerCase().match(self.offersFilterString.toLowerCase())) {
					self.generate(i ,item);
				}
			});
		} else {
			$.each(self.collection, function (i, item) {
				self.generate(i, item);
			});
		}
		$(document).on('click', '.tabLinea.empty', function() {
			var thisEl = $(this);
			var element = $(this);
			var relatedArgs = [element.data('id')];
			var generateArgs = [
				element.closest('ul').siblings('.tab-content').find('#lineas-' + element.data('id')),
				element.data('id')
			];

			main.checkLocalStorage(
				thisEl,
				offers.collection,
				'lineas',
				generateArgs,
				relatedArgs,
				true
			);

			thisEl.removeClass('empty');
		});
		$(document).on('click', '.tabParque.empty', function() {
			var thisEl = $(this);
			var element = $(this).closest('ul').siblings('.tab-content').find('#parque-' + $(this).data('id'));
			var relatedArgs = [
				$(this).data('id'),
				$(this)
			];
			var generateArgs = [
				element,
				thisEl.data('id')
			];

			main.checkLocalStorage(
				thisEl,
				offers.collection,
				'parque',
				generateArgs,
				relatedArgs,
				false,
				true
			);

			thisEl.removeClass('empty');
		});
		$(document).on('click', '.tabCumplimiento.empty', function() {
			var thisEl = $(this);
			var element = $(this).closest('ul').siblings('.tab-content').find('#cumplimientos-' + $(this).data('id'));
			var generateArgs = [
				element,
				thisEl.data('id')
			];
			var relatedArgs = [
				thisEl.data('id'),
				element,
				'cumplimiento',
				''
			];

			main.checkLocalStorage(
				thisEl,
				offers.collection,
				'notification',
				generateArgs,
				relatedArgs
			);

			thisEl.removeClass('empty');
		});
		// $('.tabCumplimiento.empty').one('click', function() {
		// 	var element = $(this).closest('ul').siblings('.tab-content').find('#cumplimientos-' + $(this).data('id'));
		// 	notification.generate(
		// 		element,
		// 		notification.get(
		// 			$(this).data('id'),
		// 			element,
		// 			'cumplimiento',
		// 			''
		// 		)
		// 	);
		// 	$(this).removeClass('empty');
		// });
		$('.menu .item').tab();
		self.$btnDelete = $('.btnDelete');
		self.$btnDelete.on('click', function() {
			var collectionType = $(this).data('collection');
			var deletedId = $(this).data('compid');
			$('.ui.basic.modal').modal('show');
			$('.ui.basic.modal .actions .ok').off('click');
			$('.ui.basic.modal .actions .ok').one('click', function(){
				self.btnDelete(deletedId);
			});
		});
	},
	/**************************************************
	**              End Populate Companies
	**************************************************/
	/**************************************************
	**              Bind Events
	**************************************************/
	generate: function (i, item) {
		var self = this;
		var   avatarLength = item.avatar.length,
		      indexAvatar = parseInt(item.avatar.length) - 1,
		      indexAvatarSub,
		      fileAvatar = item.avatar[indexAvatar];

		if (fileAvatar instanceof Array && typeof fileAvatar.filename === 'undefined') {
			indexAvatarSub = parseInt(fileAvatar.length) -1;
			fileAvatar = fileAvatar[indexAvatarSub];
		}

		(typeof fileAvatar !== 'undefined') ? fileAvatar = fileAvatar.file : fileAvatar = 'userImage.png';

		self.$offersList
		// Begin Dropdown Title
		.prepend($('<div />', { 'class': 'panel box border-color box-profile title compid_' + item._id })
			.append($('<div />', { 'class': 'box-tools pull-right' })
				.append($('<a />', { 'href': '/offers/edit/' + item._id, 'class': 'btn btn-box-tool' })
					.append($('<i />', { 'class': 'fa fa-pencil'}))
				)
				.append($('<a />', { 'class': 'btn btn-box-tool btn-delete', 'data-toggle': 'modal', 'data-target': '#myModal', 'data-collection': 'offers', 'data-id': item._id })
					.append($('<i />', { 'class': 'fa fa-remove'}))
				)
			)
			.append($('<a />', { 'class': 'accordion collapsed', 'data-toggle': 'collapse', 'data-parent': '#accordion', 'aria-expanded': false, 'href': '#compid_' + item._id })
				.append($('<img />', { 'class': 'profile-user-img img-responsive img-circle', 'src': '/uploads/' + fileAvatar }))
				.append($('<div />')
					.append($('<h3 />', { 'class': 'profile-username text-center capitalize', text: item.titlename }))
					.append($('<p />', { 'class': 'text-muted text-center', text: item.direccion }))
					.append($('<p />', { 'class': 'text-muted text-center', text: item.telefono }))
				)
				.append($('<hr />', { 'class': 'clear' }))
			)
			.append($('<div />', { 'class': 'panel-collapse collapse', 'id': 'compid_' + item._id, 'aria-expanded': false })
				.append($('<div />', { 'class': 'box-body no-padding' })
					.append($('<div />', { 'class': 'nav-tabs-custom' })
						.append($('<ul />', { 'class': 'nav nav-tabs' })
							.append($('<li />')
								.append($('<a />', { 'class': 'active', 'href': '#razonSocial-' + item._id, 'data-toggle': 'tab', text: 'Razón Social' })
									// .append($('<span />', { 'class': 'pull-right badge bg-blue', text: '12' }))
								)
							)
							.append($('<li />')
								.append($('<a />', { 'class': 'tabLinea empty', 'href': '#lineas-' + item._id, 'data-toggle': 'tab', text: 'Líneas', 'data-id': item._id }))
							)
							.append($('<li />')
								.append($('<a />', { 'class': 'tabParque empty', 'href': '#parque-' + item._id, 'data-toggle': 'tab', text: 'Parque Movil', 'data-id': item._id }))
							)
							.append($('<li />')
								.append($('<a />', { 'class': 'tabCumplimiento empty', 'href': '#cumplimientos-' + item._id, 'data-toggle': 'tab', text: 'Cumplimientos', 'data-id': item._id }))
								// .append($('<span />', { 'class': 'pull-right badge bg-blue', text: '12' }))
							)
						)
						.append($('<div />', { 'class': 'tab-content' })
							.append($('<div />', { 'class': 'tab-pane active', 'id': 'razonSocial-' + item._id })
								.append(
									(typeof item !== 'undefined' && typeof item.files !== 'undefined') ?
										$('<div />', { 'class': 'row cards' })
											.append(
											(item.files.length !== 0) ?
												$.map(item.files, function(mapFile, indexFile) {
													var fileuploaded = 
														$('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
														.append($('<div />', { 'class': 'card-pf box border-color' })
															.append($('<h4 />', { 'class': 'box-header text-center', text: mapFile.filetypes }))
															.append($('<div />', { 'class': 'box-body' })
																.append($('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFile.file, text: mapFile.filename || mapFile.file })
																	.prepend($('<i />', { 'class': 'fa fa-file' }))
																)
															)
															.append($('<div />', { 'class': 'box-footer text-center' })
																.append($('<p />')
																	.append($('<strong />', { text: 'Vencimiento' }))
																)
																.append($('<p />')
																	.append($('<span />', { text: mapFile.expiration }))
																)
															)
														);
													var missingFile = $('<div />', { text: 'Falta Archivo' });
													return (typeof mapFile !== 'undefined' && typeof mapFile.file !== 'undefined') ?
														fileuploaded
													:
														$.map(mapFile, function(mapFileSub, indexFileSub) {
															fileuploaded = 
																$('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
																.append($('<div />', { 'class': 'card-pf box border-color' })
																	.append($('<h4 />', { 'class': 'box-header text-center', text: mapFileSub.filetypes }))
																	.append($('<div />', { 'class': 'box-body' })
																		.append($('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFileSub.file, text: mapFileSub.filename || mapFileSub.file })
																			.prepend($('<i />', { 'class': 'fa fa-file' }))
																		)
																	)
																	.append($('<div />', { 'class': 'box-footer text-center' })
																		.append($('<p />')
																			.append($('<strong />', { text: 'Vencimiento' }))
																		)
																		.append($('<p />')
																			.append($('<span />', { text: mapFileSub.expiration }))
																		)
																	)
																);
															return (typeof mapFileSub !== 'undefined' && typeof mapFileSub.file !== 'undefined') ?
																fileuploaded
															:
																missingFile
														})
												})
											:
												''
											)
									:
										''
								)
							)
							.append($('<div />', { 'class': 'tab-pane', 'id': 'lineas-' + item._id }))
							.append($('<div />', { 'class': 'tab-pane', 'id': 'parque-' + item._id }))
							.append($('<div />', { 'class': 'tab-pane', 'id': 'cumplimientos-' + item._id }))
						)
					)
				)
			)
		);
	},
	/**************************************************
	**              End Populate Companies
	**************************************************/
	/**************************************************
	**				Begin Init Offers
	**************************************************/
	initController: function (mode) {
		var self = this;

		// $.each(self.collection, function (i, item) {
		// 	self.generate($('.offers' + mode), i, item);
		// });
		self.populate();
		main.overlay.hide();
	},
	/**************************************************
	**				End Init Offers
	**************************************************/
	/**************************************************
	**        Begin get tarifas
	**************************************************/
	getTarifas: function (tarifa_id, offers, linea) {
		var self = this;
		var compid = offers;
		var lineaid = linea;

		$.ajax({
			url: "/tarifas/related",
			type:"POST",
			async: false,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: {
				tarifa: tarifa_id,
				prevDate: self.tarifaPrevDate,
				nextDate: self.tarifaNextDate
			}
		}).done(function( data ) {
			console.log(data);
			self.tarifas = data.collection;
			if (typeof self.tarifas !== 'undefined') {
				// self.collection[compid].lineas[lineaid] = Object.assign({'tarifa': self.tarifas}, self.tarifasIds);
				self.tarifasIds.push({
					'tarifa_id': tarifa_id,
					'tarifa_obj': self.tarifas
				});
				console.log(self.tarifas);
				// console.log(indexLinea);
				// console.log(index);
				// if (typeof self.collection[index].lineas !== 'undefined') {
				// 	self.collection[index].lineas[indexLinea] = Object.assign({'ramales': self.ramales}, self.collection[index].lineas[indexLinea])
				// }
			}
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
		});
	},
	/**************************************************
	**        End get Lineas
	**************************************************/
	/**************************************************
	**        Start submit
	**************************************************/
	registerOffers: function (adminId) {
		var self = this;
		var mode = 'register';

		if (self.mode == 'edit') {
			var edit_id = window.location.pathname;
			mode = 'update/' + edit_id.substring(edit_id.lastIndexOf('/')+1);
		} else {
			mode = 'register';
		}

		var offersRegArr = $('form#offersForm').serializeArray();
		if (typeof adminId !== 'undefined') {
			offersRegArr.push({ name: 'admin_id', value: adminId});
		}

		$.each($('.actions'), function (i, item) {
			var selectedOptions = [];
			$.each($('.dropdown.multiple a', item), function (index, element) {
				var action = $(this).attr('data-value');
				selectedOptions.push(action);
			});
			// $('input', item).val(selectedOptions);
			offersRegArr.push({ name: 'staff_actions', value: selectedOptions});
		});

		$.ajax({
			url: "/offers/" + mode,
			type:"POST",
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: offersRegArr,
			success:function(data){
				console.log('success');
				console.log(data);
				window.location.href = '/offers';
				//whatever you wanna do after the form is successfully submitted
			},
			fail:function(data) {
				console.log('fail');
			}
		});
	},
	/**************************************************
	**        End list
	**************************************************/
	/**************************************************
	**        Start submit
	**************************************************/
	submit: function (value) {
		// var self = this;


		// $('form').submit(function(e){
		// 	e.preventDefault();

		// 	self.uploadImg($('.avatar'), 'avatar');

		// 	self.uploadFile($('.estatuto_file'), 'estatuto');
		// 	self.uploadFile($('.acta_file'), 'acta');
		// 	self.uploadFile($('.fideicomiso_file'), 'fideicomiso');
		// 	self.uploadFile($('.gestion_file'), 'gestion');
		// 	self.uploadFile($('.gestion_file'), 'balance');

		// 	// self.registerAdmin();
		// 	self.registerOffers();

		// });
	},
	/**************************************************
	**        End submit
	**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var offers = new Offers();
