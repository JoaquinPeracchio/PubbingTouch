	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Category = function () {

	/**************************************************
					Begin Selectors
	**************************************************/


	// Body
	this.$body = $('body');
	// Loader
	this.$loader = $('#loader');

	this.$form = $(document).find('form');

		this.$expiration = this.$form.find('.expiration');
		this.$rangestart = this.$form.find('#rangestart');
			this.$categorytart = this.$rangestart.find('#categorytart');
		this.$rangeend = this.$form.find('#rangeend');
			this.$categoryend = this.$rangeend.find('#categoryend');

		this.$inputSector = this.$form.find('#sector');
		this.$sector = this.$form.find('.sector');
		this.$tableStatus = this.$form.find('.tableStatus');

		this.$draggableArea = this.$form.find('#draggableArea');
			this.$tableItem = $(document).find('.tableItem');
			this.$available = $(document).find('.tableItem.available');

		this.$reservedTable = this.$form.find('#reserved_table');

		this.$reservedBy = this.$form.find('#reserved_by');

	this.$content = $('.content');
	// Category Page
		this.$categoryFilter = this.$content.find('.categoryFilter');
			this.$categorySortSelect = this.$categoryFilter.find('select');
			this.$categorySortBy = this.$categoryFilter.find('.sortBy');
			this.$categorySortOrder = this.$categoryFilter.find('.sortOrder');
			this.$categoryFilterString = this.$categoryFilter.find('.stringFilter')
		this.$categoryList = this.$content.find('.categorylist');

	this.$btnDelete;
	this.$deleteParque;

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.mode = this.$body.data('mode');

	this.access_token = window.localStorage.getItem('access_token');

	this.controller = 'category';
	this.categories;
	this.parque;
	this.lineas;
	this.ramales;

	this.tarifa = [];
	this.category = [];
	this.tables;
	this.bokings;
	this.configuration;
	this.tarifas;

	this.tarifasIds = [];

	this.today = new Date();
	this.tomorrow = new Date();
		this.tomorrow.setDate(this.today.getDate()+1);

	this.mm = String(this.today.getMonth()).padStart(2, '0'); //January is 0!
	this.yyyy = this.today.getFullYear();

	this.tarifaPrevDate = new Date(this.yyyy, this.mm);
	this.tarifaNextDate = new Date(this.yyyy, this.mm);
		this.tarifaPrevDate = new Date(this.tarifaPrevDate.setDate(this.tarifaPrevDate.getDate() - 1)).toISOString();
		this.tarifaNextDate = new Date(this.tarifaNextDate.setDate(this.tarifaNextDate.getDate() + 1)).toISOString();


	this.expTime = new Date(this.today).toISOString();
	this.startTime = new Date(this.today).toISOString();
	this.endTime = new Date(this.tomorrow).toISOString();

	this.init();
};

Category.prototype = {
	init: function () {
		var self = this;

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
	getAll: function (callback) {
		var self = this;

		// self.$categoryList.empty();

		$.ajax({
			// url: "/category/categoryinfo",
			url: "/category/list",
			type:"GET",
			async: true,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
		}).done(function( data ) {
			console.log(data);
			self.collection = data.collection;
			window.localStorage.setItem('category', JSON.stringify(self.collection));
			main.functionsObj['category'] = category;
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
	**              category List
	**************************************************/
	getRelated: function (callback) {
		var self = this;

		// self.$categoryList.empty();

		$.ajax({
			// url: "/category/categoryinfo",
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
			window.localStorage.setItem('category', JSON.stringify(self.collection));
			main.functionsObj['category'] = category;
			callback(data);
			// if (self.collection.length != 0) {
			// 	$.each(self.collection, function (i, item) {
			// 		self.getLineas(self.collection[i]._id, i);
			// 	});
			// 	main.sortProperties(data.category, self.$categorySortBy.val(), self.$categorySortOrder.val());
			// (populate) ? self.populate() : '';
			// }
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			callback('fail');
		});

	},
	/**************************************************
	**              End category List
	**************************************************/
	/**************************************************
	**        Begin Generate Parque
	**************************************************/
	// generateTabs: function (element, categoryID) {
	// 	var self = this;

	// 	element.append(
	// 	$('<div />', { 'class': 'box-body align-center' })
	// 		.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/category/register', text: 'Agregar Categoria' }))
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

		// self.$categoryList.empty();
		if (self.categoryFilterFlag) {
			$.each(self.collection, function (i, item) {
				if (String(item[self.$categorySortBy.val()]).toLowerCase().match(self.categoryFilterString.toLowerCase())) {
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
				category.collection,
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
				category.collection,
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
				category.collection,
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

		self.$categoryList
		// Begin Dropdown Title
		.prepend($('<div />', { 'class': 'panel box border-color box-profile title compid_' + item._id })
			.append($('<div />', { 'class': 'box-tools pull-right' })
				.append($('<a />', { 'href': '/category/edit/' + item._id, 'class': 'btn btn-box-tool' })
					.append($('<i />', { 'class': 'fa fa-pencil'}))
				)
				.append($('<a />', { 'class': 'btn btn-box-tool btn-delete', 'data-toggle': 'modal', 'data-target': '#myModal', 'data-collection': 'category', 'data-id': item._id })
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
	**				Begin Init Category
	**************************************************/
	initController: function (mode) {
		var self = this;

		// $.each(self.collection, function (i, item) {
		// 	self.generate($('.category' + mode), i, item);
		// });
		self.populate();
		main.overlay.hide();
	},
	/**************************************************
	**				End Init Category
	**************************************************/
	/**************************************************
	**        Begin get tarifas
	**************************************************/
	getTarifas: function (tarifa_id, category, linea) {
		var self = this;
		var compid = category;
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
	registerCategory: function (adminId) {
		var self = this;
		var mode = 'register';

		if (self.mode == 'edit') {
			var edit_id = window.location.pathname;
			mode = 'update/' + edit_id.substring(edit_id.lastIndexOf('/')+1);
		} else {
			mode = 'register';
		}

		var categoryRegArr = $('form#categoryForm').serializeArray();
		if (typeof adminId !== 'undefined') {
			categoryRegArr.push({ name: 'admin_id', value: adminId});
		}

		$.each($('.actions'), function (i, item) {
			var selectedOptions = [];
			$.each($('.dropdown.multiple a', item), function (index, element) {
				var action = $(this).attr('data-value');
				selectedOptions.push(action);
			});
			// $('input', item).val(selectedOptions);
			categoryRegArr.push({ name: 'staff_actions', value: selectedOptions});
		});

		$.ajax({
			url: "/category/" + mode,
			type:"POST",
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: categoryRegArr,
			success:function(data){
				console.log('success');
				console.log(data);
				window.location.href = '/category';
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
		// 	self.registerCategory();

		// });
	},
	/**************************************************
	**        End submit
	**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var category = new Category();
