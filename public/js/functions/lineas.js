	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Linea = function () {

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
			this.$lineastart = this.$rangestart.find('#lineastart');
		this.$rangeend = this.$form.find('#rangeend');
			this.$lineasend = this.$rangeend.find('#lineasend');

		this.$inputSector = this.$form.find('#parent');
		this.$parent = this.$form.find('.parent');
		this.$tableStatus = this.$form.find('.tableStatus');

		this.$draggableArea = this.$form.find('#draggableArea');
			this.$tableItem = $(document).find('.tableItem');
			this.$available = $(document).find('.tableItem.available');

		this.$reservedTable = this.$form.find('#reserved_table');

		this.$reservedBy = this.$form.find('#reserved_by');

	this.$content = $('#content');
	// Linea Page
		this.$lineasFilter = this.$content.find('.lineasFilter');
			this.$lineasSortSelect = this.$lineasFilter.find('select');
			this.$lineasSortBy = this.$lineasFilter.find('.sortBy');
			this.$lineasSortOrder = this.$lineasFilter.find('.sortOrder');
			this.$lineasFilterString = this.$lineasFilter.find('.stringFilter')
		this.$lineasList = this.$content.find('.lineaslist');

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.mode = this.$body.data('mode');

	this.access_token = window.localStorage.getItem('access_token');

	this.controller = 'lineas';
	this.collection;

	this.users = [];
	this.tables;
	this.bokings;
	this.configuration;

	this.tableId;

	this.today = new Date();
	this.tomorrow = new Date();
		this.tomorrow.setDate(this.today.getDate()+1);

	this.startTime = new Date(this.today).toISOString();
	this.endTime = new Date(this.tomorrow).toISOString();

	this.init();
};

Linea.prototype = {
	init: function () {
		var self = this;

		// self.submit();
	},
	/**************************************************
	**        Begin get lineas
	**************************************************/
	getById: function (lineaID, callback) {
		var self = this;
		var ajaxResult;
		// var element = element;

		$.ajax({
			url: "/lineas/get/" + lineaID,
			type:"POST",
			async: false,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: {
				lineaid: lineaID
			}
		}).done(function( data ) {
			self.collection = JSONparse(window.localStorage.getItem('lineas-' + data.parent));
			console.log(data.collection);
			ajaxResult = data.collection;

		}).fail(function( data ) {
			ajaxResult = data.collection;
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
		});
		(typeof callback !== 'undefined') ? callback(ajaxResult) : '';
	},
	/**************************************************
	**        End get Lineas
	**************************************************/
	/**************************************************
	**        Begin get lineas
	**************************************************/
	getRelated: function (companyID, callback) {
		var self = this;
		// var element = element;

		$.ajax({
			url: "/lineas/related",
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
			var key = 'lineas-' + companyID;
			if (Array.isArray(self.collection) && self.collection.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(self.collection));
				main.functionsObj['lineas'] = lineas;
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
	**        End get Lineas
	**************************************************/
	/**************************************************
	**        Begin Generate Tabs
	**************************************************/
	generateTabs: function (element, companyID) {
		var self = this;

		element.prepend(
		$('<div />', { 'class': 'box-body align-center' })
			.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/lineas/register', text: 'Agregar Linea' }))
		)
	},
	/**************************************************
	**        End Generate Tabs
	**************************************************/
	/**************************************************
	**        Begin Generate lineas
	**************************************************/
	generate: function (element, companyID, item) {
		var self = this;
		// var item = lineas.collection.find(selItem => selItem._id === itemID);
		var element = element;

		item.subsidios = item.subsidios || [];
		item.documentos = item.documentos || [];
		// Begin Array
		element.append(
			// $.map(parentCompany.lineas, function(mapLinea, indexLinea) {
				// Begin Dropdown Title
				// return $('<div />', { 'class': 'empty' })
				// Begin Dropdown Title
				$('<div />', { 'class': 'panel box border-color box-profile title lineaid' + item._id })
					.append($('<div />', { 'class': 'box-tools pull-right' })
						.append($('<a />', { 'href': '/lineas/edit/' + item._id, 'class': 'btn btn-box-tool' })
							.append($('<i />', { 'class': 'fa fa-pencil'}))
						)
						.append($('<a />', { 'class': 'btn btn-box-tool btn-delete', 'data-toggle': 'modal', 'data-target': '#myModal', 'data-collection': 'lineas', 'data-id': item._id })
							.append($('<i />', { 'class': 'fa fa-remove'}))
						)
					)
					.append($('<a />', { 'class': 'accordion collapsed', 'data-toggle': 'collapse', 'data-parent': '#accordion', 'aria-expanded': false, 'href': '#lineaid' + item._id })
						.append($('<span />', { 'class': 'pull-left img-responsive', 'style': 'text-align: center; font-size: 45px;' })
							.append($('<i />', { 'class': 'fa fa-random' }))
						)
						.append($('<div />')
							.append($('<h3 />', { 'class': 'profile-username text-center capitalize', text: item.titlename }))
							.append($('<p />', { 'class': 'text-muted text-center', text: item.direccion }))
							.append($('<p />', { 'class': 'text-muted text-center', text: item.telefono }))
						)
						.append($('<hr />', { 'class': 'clear' }))
					)
					.append($('<div />', { 'class': 'panel-collapse collapse', 'id': 'lineaid' + item._id, 'aria-expanded': false })
						.append($('<div />', { 'class': 'box-body no-padding' })
							.append($('<div />', { 'class': 'nav-tabs-custom' })
								.append($('<ul />', { 'class': 'nav nav-tabs' })
									.append($('<li />')
										.append($('<a />', { 'class': 'active', 'href': '#servicios-' + item._id, 'data-toggle': 'tab', text: 'Servicios' })
											// .append($('<span />', { 'class': 'pull-right badge bg-blue', text: '12' }))
										)
									)
									.append($('<li />')
										.append($('<a />', { 'class': 'tabRamal empty', 'href': '#ramales-' + item._id, 'data-toggle': 'tab', text: 'Ramales', 'data-id': item._id, 'data-compid': companyID }))
									)
									.append($('<li />')
										.append($('<a />', { 'class': 'tabHorario empty', 'href': '#horarios-' + item._id, 'data-toggle': 'tab', text: 'Horarios', 'data-id': item._id, 'data-compid': companyID })
											.append($('<ul />', { 'class': 'dropdown-menu pull-right', 'role': 'menu' })
												.append($('<li />')
													.append($('<a />', { 'href': '/horarios/register', text : 'Horario' }))
												)
												.append($('<li />')
													.append($('<a />', { 'href': '/horarios/registercontrolador', text : 'Controlador' }))
												)
											)
										)
									)
								)
								.append($('<div />', { 'class': 'tab-content' })
									.append($('<div />', { 'class': 'tab-pane active', 'id': 'servicios-' + item._id })
										.append($('<div />', { 'class': 'row cards' })
											.append($('<div />', { 'class': 'col-md-5th-1 col-sm-4 col-md-offset-0 col-sm-offset-2' })
												// Begin If
												.append(
													(item.gasoil) ?
														$('<div />', { 'class': 'info-box' })
															.append($('<span />', { 'class': 'info-box-icon bg-green' })
																.prepend($('<i />', { 'class': 'fa fa-check' }))
															)
															.append($('<div />', { 'class': 'info-box-content' })
																.append($('<span />', { 'class': 'info-box-text', text: 'GASOIL' }))
															)
													:
														$('<div />', { 'class': 'info-box' })
															.append($('<span />', { 'class': 'info-box-icon bg-red' })
																.prepend($('<i />', { 'class': 'fa fa-remove' }))
															)
															.append($('<div />', { 'class': 'info-box-content' })
																.append($('<span />', { 'class': 'info-box-text', text: 'GASOIL' }))
															)
												) // End If
											)
											.append($('<div />', { 'class': 'col-md-5th-1 col-sm-4' })
												// Begin If
												.append(
													(item.sistau) ?
														$('<div />', { 'class': 'info-box' })
															.append($('<span />', { 'class': 'info-box-icon bg-green' })
																.prepend($('<i />', { 'class': 'fa fa-check' }))
															)
															.append($('<div />', { 'class': 'info-box-content' })
																.append($('<span />', { 'class': 'info-box-text', text: 'SISTAU' }))
															)
													:
														$('<div />', { 'class': 'info-box' })
															.append($('<span />', { 'class': 'info-box-icon bg-red' })
																.prepend($('<i />', { 'class': 'fa fa-remove' }))
															)
															.append($('<div />', { 'class': 'info-box-content' })
																.append($('<span />', { 'class': 'info-box-text', text: 'SISTAU' }))
															)
												) // End If
											)
											.append($('<div />', { 'class': 'col-md-5th-1 col-sm-4' })
												// Begin If
												.append(
													(item.rcc) ?
														$('<div />', { 'class': 'info-box' })
															.append($('<span />', { 'class': 'info-box-icon bg-green' })
																.prepend($('<i />', { 'class': 'fa fa-check' }))
															)
															.append($('<div />', { 'class': 'info-box-content' })
																.append($('<span />', { 'class': 'info-box-text', text: 'RCC' }))
															)
													:
														$('<div />', { 'class': 'info-box' })
															.append($('<span />', { 'class': 'info-box-icon bg-red' })
																.prepend($('<i />', { 'class': 'fa fa-remove' }))
															)
															.append($('<div />', { 'class': 'info-box-content' })
																.append($('<span />', { 'class': 'info-box-text', text: 'RCC' }))
															)
												) // End If
											)
											.append($('<div />', { 'class': 'col-md-5th-1 col-sm-4' })
												// Begin If
												.append(
													(item.ccp) ?
														$('<div />', { 'class': 'info-box' })
															.append($('<span />', { 'class': 'info-box-icon bg-green' })
																.prepend($('<i />', { 'class': 'fa fa-check' }))
															)
															.append($('<div />', { 'class': 'info-box-content' })
																.append($('<span />', { 'class': 'info-box-text', text: 'CCP' }))
															)
													:
														$('<div />', { 'class': 'info-box' })
															.append($('<span />', { 'class': 'info-box-icon bg-red' })
																.prepend($('<i />', { 'class': 'fa fa-remove' }))
															)
															.append($('<div />', { 'class': 'info-box-content' })
																.append($('<span />', { 'class': 'info-box-text', text: 'CCP' }))
															)
												) // End If
											)
											.append($('<div />', { 'class': 'col-md-5th-1 col-sm-4' })
												// Begin If
												.append(
													(item.amba) ?
														$('<div />', { 'class': 'info-box' })
															.append($('<span />', { 'class': 'info-box-icon bg-green' })
																.prepend($('<i />', { 'class': 'fa fa-check' }))
															)
															.append($('<div />', { 'class': 'info-box-content' })
																.append($('<span />', { 'class': 'info-box-text', text: 'AMBA' }))
															)
													:
														$('<div />', { 'class': 'info-box' })
															.append($('<span />', { 'class': 'info-box-icon bg-red' })
																.prepend($('<i />', { 'class': 'fa fa-remove' }))
															)
															.append($('<div />', { 'class': 'info-box-content' })
																.append($('<span />', { 'class': 'info-box-text', text: 'AMBa' }))
															)
												) // End If
											)
										)
										.append($('<div />', { 'class': 'row cards' })
											.append($('<div />', { 'class': 'col-md-12' })
												.append($('<div />', { 'class': 'box box-success' })
													.append($('<div />', { 'class': 'box-header' })
														.append($('<h3 />', { 'class': 'box-title', text: 'Documentos' }))
													)
													.append($('<div />', { 'class': 'box-body no-padding' })
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
												)
											)
										)
									)
									.append($('<div />', { 'class': 'tab-pane', 'id': 'ramales-' + item._id })
									)
									.append($('<div />', { 'class': 'tab-pane', 'id': 'horarios-' + item._id })
									)
								)
							)
						)
					)
			// })
		); // End Array

		// $('.tabHorario.empty').one('click', function() {
		// 	console.log('tabRamal');
		// 	horarios.getHorarios($(this).data('compid'), $(this).data('id'), $(this));
		// 	$(this).removeClass('empty');
		// });
	},
	/**************************************************
	**        End Generate Lineas
	**************************************************/
	/**************************************************
	**        Start Bind Tabs
	**************************************************/
	bindTabs: function () {
		var self = this;

		$('.tabRamal.empty').one('click', function() {
			var thisEl = $(this);
			var element = $(this);
			var relatedArgs = [
				element.data('compid'),
				element.data('id')
			];
			var generateArgs = [
				element.closest('ul').siblings('.tab-content').find('#ramales-' + element.data('id')),
				element.data('compid'),
				element.data('id')
			];
			var lineaColl = company.collection[main.getIndex(company.collection, element.data('compid'))].lineas || JSON.parse(window.localStorage.getItem('lineas-' + element.data('compid')));

			main.checkLocalStorage(
				thisEl,
				lineaColl,
				'ramales',
				generateArgs,
				relatedArgs
			);

			thisEl.removeClass('empty');
		});
		$('.tabHorario.empty').one('click', function() {
			var thisEl = $(this);
			var element = $(this);
			var relatedArgs = [
				element.data('compid'),
				element.data('id')
			];
			var generateArgs = [
				element.closest('ul').siblings('.tab-content').find('#horarios-' + element.data('id')),
				element.data('compid'),
				element.data('id')
			];
			var ramalColl = company.collection[main.getIndex(company.collection, element.data('compid'))].lineas || JSON.parse(window.localStorage.getItem('lineas-' + element.data('compid')));

			main.checkLocalStorage(
				thisEl,
				ramalColl,
				'horarios',
				generateArgs,
				relatedArgs
			);

			thisEl.removeClass('empty');
		});
	},
	/**************************************************
	**        End submit
	**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var lineas = new Linea();
