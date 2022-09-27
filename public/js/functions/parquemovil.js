	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Parque = function () {

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
			this.$parquemoviltart = this.$rangestart.find('#parquemoviltart');
		this.$rangeend = this.$form.find('#rangeend');
			this.$parquemovilend = this.$rangeend.find('#parquemovilend');

		this.$inputSector = this.$form.find('#parent');
		this.$parent = this.$form.find('.parent');
		this.$tableStatus = this.$form.find('.tableStatus');

		this.$draggableArea = this.$form.find('#draggableArea');
			this.$tableItem = $(document).find('.tableItem');
			this.$available = $(document).find('.tableItem.available');

		this.$reservedTable = this.$form.find('#reserved_table');

		this.$reservedBy = this.$form.find('#reserved_by');

	this.$content = $('#content');
	// Parque Page
		this.$parquemovilFilter = this.$content.find('.parquemovilFilter');
			this.$parquemovilSortSelect = this.$parquemovilFilter.find('select');
			this.$parquemovilSortBy = this.$parquemovilFilter.find('.sortBy');
			this.$parquemovilSortOrder = this.$parquemovilFilter.find('.sortOrder');
			this.$parquemovilFilterString = this.$parquemovilFilter.find('.stringFilter')
		this.$parquemovilList = this.$content.find('.parquemovillist');

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.mode = this.$body.data('mode');

	this.access_token = window.localStorage.getItem('access_token');

	this.controller = 'parquemovil';

	this.parque;

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

Parque.prototype = {
	init: function () {
		var self = this;

		self.submit();
	},
	/**************************************************
	**        Begin get parquemovil
	**************************************************/
	getRelated: function (companyID) {
		var self = this;
		var compid = companyID;

		$.ajax({
			url: "/parquemovil/related",
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
			console.log(data);
			self.collection = data.collection;
			var key = 'parque-' + companyID;

			if (Array.isArray(self.collection) && self.collection.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(self.collection));
				main.functionsObj['parque'] = parque;
			}
			// var index = company.collection.findIndex(compEl => compEl._id === compid);
			// console.log(index);
			// company.collection[index] = Object.assign({'parque': self.collection}, company.collection[index])
			// self.generate(element, index, compid);
			// $.each(self.collection, function (i, item) {
			// 	console.log(item);
			// 	console.log(i);
			// 	console.log(index);
			// 	self.getRamales(self.collection[i]._id, i, index);
			// });
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
		});
	},
	/**************************************************
	**        End get Parques
	**************************************************/
	/**************************************************
	**        Begin Generate Parque
	**************************************************/
	generateTabs: function (element, companyID) {
		var self = this;

		element.prepend(
		$('<div />', { 'class': 'box-body align-center' })
			.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/parquemovil/jurada/' + companyID, text: 'Agregar Jurada Anual' }))
			.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/parquemovil/movimientos/' + companyID, text: 'Agregar Movimiento' }))
			.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/parquemovil/varios/' + companyID, text: 'Agregar Varios' }))
		)
		.append($('<div />', { 'class': 'nav-tabs-custom' })
				.append($('<ul />', { 'class': 'nav nav-tabs' })
					.append($('<li />')
						.append($('<a />', { 'class': 'tabInfoParque active', 'href': '#info-parque-' + companyID, 'data-toggle': 'tab', text: 'General' })
							// .append($('<span />', { 'class': 'pull-right badge bg-blue', text: '12' }))
						)
					)
					.append($('<li />')
						.append($('<a />', { 'class': 'tabMovParque empty', 'href': '#mov-parque-' + companyID, 'data-toggle': 'tab', text: 'Movimientos', 'data-id': companyID, 'data-compid': companyID }))
					)
					.append($('<li />')
						.append($('<a />', { 'class': 'tabVariosParque empty', 'href': '#varios-parque-' + companyID, 'data-toggle': 'tab', text: 'Varios', 'data-id': companyID, 'data-compid': companyID }))
					)
				)
				.append($('<div />', { 'class': 'tab-content' })
					.append($('<div />', { 'class': 'tab-pane contentInfoParque active', 'id': 'info-parque-' + companyID })
						.append($('<div />', { 'class': 'row cards' })
						)
					)
					.append($('<div />', { 'class': 'tab-pane contentMovParque', 'id': 'mov-parque-' + companyID })
						.append($('<div />', { 'class': 'row cards' })
						)
					)
					.append($('<div />', { 'class': 'tab-pane contentVariosParque', 'id': 'varios-parque-' + companyID })
						.append($('<div />', { 'class': 'row cards' })
						)
					)
				)
		); // End Array
	},
	/**************************************************
	**        End get Parques
	**************************************************/
	/**************************************************
	**        Begin Generate Parque
	**************************************************/
	generate: function (element, companyID, item) {
		var self = this;
		var jurada_last = true;
		var pm_last = true;
		// var parentCompany = item.parent;
		if (!element) {
			var element = element.closest('ul').siblings('.tab-content').find('#parque-' + companyID);
		}


		// .append(
			// $.map(parentCompany.parque, function(item, indexParque) {
				console.log(item.register_type);
				item.tramite_id = item.tramite_id || 'Nº Tramite';
				item.files = item.files || [];
				if (item.register_type == 'contentInfoParque' && (jurada_last || pm_last)) {
					if (typeof item.files[0] !== 'undefined') {
						jurada_last = false;
						element.find('.' + item.register_type + ' .row')
											.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
												.append($('<div />', { 'class': 'box box-success' })
													.append($('<h3 />', { text: 'Jurada Anual' }))
													.append($('<div />', { 'class': 'box-tools pull-right' })
														.append($('<a />', { 'href': '/parquemovil/edit/jurada/' + item._id, 'class': 'btn btn-box-tool' })
															.append($('<i />', { 'class': 'fa fa-pencil'}))
														)
														.append($('<a />', { 'class': 'btn btn-box-tool deleteParque', 'data-collection': 'parquemovil', 'data-compid': item._id })
															.append($('<i />', { 'class': 'fa fa-remove'}))
														)
													)
													.append($('<div />', { 'class': 'box-body no-padding' })
														.append(
															(typeof item.files !== 'undefined' && typeof item.files !== 'undefined' && item.files.length !== 0) ?
																$('<div />', { 'class': 'row cards' })
																.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
																	.append(
																		$.map(item.files, function(mapFiles, indexFiles) {
																			var fileuploaded = $('<div />', { 'class': 'card-pf box border-color' })
																				.append($('<h4 />', { 'class': 'box-header text-center capitalize', text: mapFiles.filetypes }))
																				.append($('<div />', { 'class': 'box-body' })
																					.append($('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFiles.filename, text: mapFiles.title || mapFiles.file })
																						.prepend($('<i />', { 'class': 'fa fa-file' }))
																					)
																				)
																				.append(
																					(mapFiles.expiration !== null) ?
																						$('<div />', { 'class': 'box-footer text-center' })
																						.append($('<p />')
																							.append($('<strong />', { text: 'Vencimiento' }))
																						)
																						.append($('<p />')
																							.append($('<span />', { text: mapFiles.expiration }))
																						)
																					: $('<div />', { 'class': 'empty' })
																				);
																			var missingFile = $('<div />', { text: 'Falta Archivo' });
																			return (typeof mapFiles !== 'undefined' && typeof mapFiles.file !== 'undefined') ?
																				fileuploaded
																			:
																				$.map(mapFiles, function(mapFilesSub, indexFilesSub) {
																					fileuploaded = $('<div />', { 'class': 'card-pf box border-color' })
																						.append($('<h4 />', { 'class': 'box-header text-center capitalize', text: mapFilesSub.filetypes }))
																						.append($('<div />', { 'class': 'box-body' })
																							.append($('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFilesSub.filename, text: mapFilesSub.title || mapFilesSub.file })
																								.prepend($('<i />', { 'class': 'fa fa-file' })
																								)
																							)
																						)
																						.append(
																							(mapFilesSub.expiration !== null) ?
																								$('<div />', { 'class': 'box-footer text-center' })
																								.append($('<p />')
																									.append($('<strong />', { text: 'Vencimiento' }))
																								)
																								.append($('<p />')
																									.append($('<span />', { text: mapFilesSub.expiration }))
																								)
																							: $('<div />', { 'class': 'empty' })
																						);
																					return (typeof mapFilesSub !== 'undefined' && typeof mapFilesSub.file !== 'undefined') ?
																						fileuploaded
																					:
																						missingFile
																				})
																		})
																	) 
																) // End If
															:
																''
														)
													)
												)
											)
					} else if (typeof item.files[0]!== 'undefined') {
						pm_last = false;
						element.find('.' + item.register_type + ' .row')
							// Begin Segment
								// (item.files.length !== 0) ?
								// // Begin Edit Button Container
											.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
												.append($('<div />', { 'class': 'box box-success' })
													.append($('<h3 />', { text: 'Varios' }))
													.append($('<div />', { 'class': 'box-tools pull-right' })
														.append($('<a />', { 'href': '/parquemovil/edit/jurada/' + item._id, 'class': 'btn btn-box-tool' })
															.append($('<i />', { 'class': 'fa fa-pencil'}))
														)
														.append($('<a />', { 'class': 'btn btn-box-tool deleteParque', 'data-collection': 'parquemovil', 'data-compid': item._id })
															.append($('<i />', { 'class': 'fa fa-remove'}))
														)
													)
													.append($('<div />', { 'class': 'box-body no-padding' })
														.append(
															(typeof item.files !== 'undefined' && typeof item.files !== 'undefined' && item.files.length !== 0) ?
																$('<div />', { 'class': 'row cards' })
																.append($('<div />', { 'class': 'col-xs-6 col-sm-6 col-md-6 col-lg-6' })
																	.append(
																		$.map(item.files, function(mapFiles, indexFiles) {
																			var fileuploaded = $('<div />', { 'class': 'card-pf box border-color' })
																				.append($('<h4 />', { 'class': 'box-header text-center capitalize', text: mapFiles.filetypes }))
																				.append($('<div />', { 'class': 'box-body' })
																					.append($('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFiles.filename, text: mapFiles.title || mapFiles.file })
																						.prepend($('<i />', { 'class': 'fa fa-file' }))
																					)
																				)
																				.append(
																					(mapFiles.expiration !== null) ?
																						$('<div />', { 'class': 'box-footer text-center' })
																						.append($('<p />')
																							.append($('<strong />', { text: 'Vencimiento' }))
																						)
																						.append($('<p />')
																							.append($('<span />', { text: mapFiles.expiration }))
																						)
																					: $('<div />', { 'class': 'empty' })
																				);
																			var missingFile = $('<div />', { text: 'Falta Archivo' });
																			return (typeof mapFiles !== 'undefined' && typeof mapFiles.file !== 'undefined') ?
																				fileuploaded
																			:
																				$.map(mapFiles, function(mapFilesSub, indexFilesSub) {
																					fileuploaded = $('<div />', { 'class': 'card-pf box border-color' })
																						.append($('<h4 />', { 'class': 'box-header text-center capitalize', text: mapFilesSub.filetypes }))
																						.append($('<div />', { 'class': 'box-body' })
																							.append($('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFilesSub.filename, text: mapFilesSub.title || mapFilesSub.file })
																								.prepend($('<i />', { 'class': 'fa fa-file' })
																								)
																							)
																						)
																						.append(
																							(mapFilesSub.expiration !== null) ?
																								$('<div />', { 'class': 'box-footer text-center' })
																								.append($('<p />')
																									.append($('<strong />', { text: 'Vencimiento' }))
																								)
																								.append($('<p />')
																									.append($('<span />', { text: mapFiles.expiration }))
																								)
																							: $('<div />', { 'class': 'empty' })
																						);
																					return (typeof mapFilesSub !== 'undefined' && typeof mapFilesSub.file !== 'undefined') ?
																						fileuploaded
																					:
																						missingFile
																				})
																		})
																	) 
															) // End If
															:
																''
														)
													)
												)
											)
					}
				} else {
					// Begin Dropdown Title
					element.find('.' + item.register_type + ' .row')
						// Begin Edit Button Container
					.append($('<div />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' })
						.append($('<div />', { 'class': 'box box-success' })
							.append($('<div />', { 'class': 'box-header text-center' })
								.append($('<h3 />', { text: item.titlename + ' / ' + item.tramite_id }))
								.append($('<div />', { 'class': 'box-tools pull-right' })
									.append(
									(item.cnrt) ?
									$('<span />', { 'class': 'label label-danger', text: 'CNRT' })
										.prepend($('<i />', { 'class': 'check circle outline icon' }))
									: $('<div/>', { 'class': 'empty' })
									)
									.append($('<a />', { 'href': '/parquemovil/edit/varios/' + item._id, 'class': 'btn btn-box-tool' })
										.append($('<i />', { 'class': 'fa fa-pencil'}))
									)
									.append($('<a />', { 'class': 'btn btn-box-tool deleteParque', 'data-collection': 'parquemovil', 'data-compid': item._id })
										.append($('<i />', { 'class': 'fa fa-remove'}))
									)
								)
							)
													.append($('<div />', { 'class': 'box-body no-padding' })
														.append(
															(typeof item.files !== 'undefined' && typeof item.files !== 'undefined' && item.files.length !== 0) ?
																$('<div />', { 'class': 'row cards' })
																	.append(
																		$.map(item.files, function(mapFiles, indexFiles) {
																			var fileuploaded = $('<div />', { 'class': 'col-xs-6 col-sm-6 col-md-6 col-lg-6' })
																				.append($('<div />', { 'class': 'card-pf box border-color' })
																					.append($('<h4 />', { 'class': 'box-header text-center capitalize', text: mapFiles.filetypes }))
																					.append($('<div />', { 'class': 'box-body' })
																						.append($('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFiles.filename, text: mapFiles.title || mapFiles.file })
																							.prepend($('<i />', { 'class': 'fa fa-file' }))
																						)
																					)
																					.append(
																						(mapFiles.expiration !== null) ?
																							$('<div />', { 'class': 'box-footer text-center' })
																							.append($('<p />')
																								.append($('<strong />', { text: 'Vencimiento' }))
																							)
																							.append($('<p />')
																								.append($('<span />', { text: mapFiles.expiration }))
																							)
																						: $('<div />', { 'class': 'empty' })
																					)
																				);
																			var missingFile = $('<div />', { text: 'Falta Archivo' });
																			return (typeof mapFiles !== 'undefined' && typeof mapFiles.file !== 'undefined') ?
																				fileuploaded
																			:
																				$.map(mapFiles, function(mapFilesSub, indexFilesSub) {
																					fileuploaded = $('<div />', { 'class': 'col-xs-6 col-sm-6 col-md-6 col-lg-6' })
																					.append($('<div />', { 'class': 'card-pf box border-color' })
																						.append($('<h4 />', { 'class': 'box-header text-center capitalize', text: mapFilesSub.filetypes }))
																						.append($('<div />', { 'class': 'box-body' })
																							.append($('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFilesSub.filename, text: mapFilesSub.title || mapFilesSub.file })
																								.prepend($('<i />', { 'class': 'fa fa-file' })
																								)
																							)
																						)
																						.append(
																							(mapFilesSub.expiration !== null) ?
																								$('<div />', { 'class': 'box-footer text-center' })
																								.append($('<p />')
																									.append($('<strong />', { text: 'Vencimiento' }))
																								)
																								.append($('<p />')
																									.append($('<span />', { text: mapFilesSub.expiration }))
																								)
																							: $('<div />', { 'class': 'empty' })
																						)
																					);
																					return (typeof mapFilesSub !== 'undefined' && typeof mapFilesSub.file !== 'undefined') ?
																						fileuploaded
																					:
																						missingFile
																				})
																		})
																	) 
																:
																	''
															) // End If
														)
													)
												)
											// )
				}
			// });
	},
	/**************************************************
	**        End Generate Parques
	**************************************************/
	/**************************************************
	**        Start submit
	**************************************************/
	submit: function (value) {
		// var self = this;


		// $('form').submit(function(e){
		// 	e.preventDefault();

		// 	self.uploadFile($('.autorizacion_file'), 'autorizacion');
		// 	self.uploadFile($('.renovacion_file'), 'renovacion');

		// 	self.registerParque();

		// });
	},
	/**************************************************
	**        End submit
	**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var parque = new Parque();
