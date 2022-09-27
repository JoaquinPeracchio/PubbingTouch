	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Company = function () {

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
			this.$companytart = this.$rangestart.find('#companytart');
		this.$rangeend = this.$form.find('#rangeend');
			this.$companyend = this.$rangeend.find('#companyend');

		this.$inputSector = this.$form.find('#sector');
		this.$sector = this.$form.find('.sector');
		this.$tableStatus = this.$form.find('.tableStatus');

		this.$draggableArea = this.$form.find('#draggableArea');
			this.$tableItem = $(document).find('.tableItem');
			this.$available = $(document).find('.tableItem.available');

		this.$reservedTable = this.$form.find('#reserved_table');

		this.$reservedBy = this.$form.find('#reserved_by');

	this.$content = $('.content');
	// Company Page
		this.$companyFilter = this.$content.find('.companyFilter');
			this.$companySortSelect = this.$companyFilter.find('select');
			this.$companySortBy = this.$companyFilter.find('.sortBy');
			this.$companySortOrder = this.$companyFilter.find('.sortOrder');
			this.$companyFilterString = this.$companyFilter.find('.stringFilter')
		this.$companyList = this.$content.find('.companylist');

	this.$btnDelete;
	this.$deleteParque;

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.mode = this.$body.data('mode');

	this.access_token = window.localStorage.getItem('access_token');

	this.controller = 'company';
	this.companies;
	this.parque;
	this.lineas;
	this.ramales;

	this.tarifa = [];
	this.users = [];
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

Company.prototype = {
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
	**              company List
	**************************************************/
	getRelated: function () {
		var self = this;

		// self.$companyList.empty();

		$.ajax({
			// url: "/company/companyinfo",
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
			window.localStorage.setItem('companies', JSON.stringify(self.collection));
			main.functionsObj['company'] = company;
			// if (self.collection.length != 0) {
			// 	$.each(self.collection, function (i, item) {
			// 		self.getLineas(self.collection[i]._id, i);
			// 	});
			// 	main.sortProperties(data.company, self.$companySortBy.val(), self.$companySortOrder.val());
			// (populate) ? self.populate() : '';
			// }
		}).fail(function() {
			main.removeToken();
			main.initLogin();
		});

	},
	/**************************************************
	**              End company List
	**************************************************/
	/**************************************************
	**        Begin Generate Parque
	**************************************************/
	// generateTabs: function (element, companyID) {
	// 	var self = this;

	// 	element.append(
	// 	$('<div />', { 'class': 'box-body align-center' })
	// 		.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/company/register', text: 'Agregar Empresa' }))
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

		// self.$companyList.empty();
		if (self.companyFilterFlag) {
			$.each(self.collection, function (i, item) {
				if (String(item[self.$companySortBy.val()]).toLowerCase().match(self.companyFilterString.toLowerCase())) {
					self.generate(i ,item);
				}
			});
		} else {
			$.each(self.collection, function (i, item) {
				self.generate(i, item);
			});
		}
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
				company.collection,
				'lineas',
				generateArgs,
				relatedArgs,
				true
			);

			thisEl.removeClass('empty');
		});
		$('.tabParque.empty').one('click', function() {
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
				company.collection,
				'parque',
				generateArgs,
				relatedArgs,
				false,
				true
			);

			thisEl.removeClass('empty');
		});
		$('.tabCumplimiento.empty').one('click', function() {
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
				company.collection,
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

		self.$companyList
		// Begin Dropdown Title
		.prepend($('<div />', { 'class': 'panel box border-color box-profile title compid_' + item._id })
			.append($('<div />', { 'class': 'box-tools pull-right' })
				.append($('<a />', { 'href': '/company/edit/' + item._id, 'class': 'btn btn-box-tool' })
					.append($('<i />', { 'class': 'fa fa-pencil'}))
				)
				.append($('<a />', { 'class': 'btn btn-box-tool btn-delete', 'data-toggle': 'modal', 'data-target': '#myModal', 'data-collection': 'company', 'data-id': item._id })
					.append($('<i />', { 'class': 'fa fa-remove'}))
				)
			)
			.append($('<a />', { 'class': 'accordion collapsed', 'data-toggle': 'collapse', 'data-parent': '#accordion', 'aria-expanded': false, 'href': '#compid_' + item._id })
				.append($('<img />', { 'class': 'profile-user-img img-responsive img-circle', 'src': '/uploads/' + fileAvatar.filename }))
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
								.append($('<div />', { 'class': 'row cards' })
									.append($('<div />', { 'class': 'col-md-4' })
										.append(
											(typeof item !== 'undefined' && typeof item.estatuto !== 'undefined') ?
												$('<div />', { 'class': 'card-pf box border-color' })
												.append($('<h4 />', { 'class': 'box-header text-center', text: 'Estatuto Social' }))
													.append(
														(item.estatuto.length !== 0) ?
															$('<div />', { 'class': 'box-body' })
															.append(
																$.map(item.estatuto, function(mapEstatuto, indexEstatuto) {
																	var fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapEstatuto.filename, text: mapEstatuto.title || mapEstatuto.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
																	var missingFile = $('<div />', { text: 'Falta Archivo' });
																	return (typeof mapEstatuto !== 'undefined' && typeof mapEstatuto.file !== 'undefined') ?
																		fileuploaded
																	:
																		$.map(mapEstatuto, function(mapEstatutoSub, indexEstatutoSub) {
																			fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapEstatutoSub.filename, text: mapEstatutoSub.title || mapEstatutoSub.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
																			return (typeof mapEstatutoSub !== 'undefined' && typeof mapEstatutoSub.file !== 'undefined') ?
																				fileuploaded
																			:
																				missingFile
																		})
																})
															)
														:
															''
													) 
												.append(
													(item.estatuto.expiration !== null) ?
														$('<div />', { 'class': 'box-footer text-center' })
														.append($('<p />')
															.append($('<strong />', { text: 'Vencimiento' }))
														)
														.append($('<p />')
															.append($('<span />', { text: item.estatuto.expiration }))
														)
													: ''
													)
												: $('<div />', { 'class': 'card-pf box border-color' })
												.append($('<h4 />', { 'class': 'box-header text-center', text: 'Estatuto Social' }))
												.append($('<div />', { 'class': 'box-footer text-center' })
													.append($('<div />', { 'class': 'ui primary', text: 'Falta Archivo' }))
												)
										) // End If
									)
									.append($('<div />', { 'class': 'col-md-4' })
										.append(
											(typeof item !== 'undefined' && typeof item.acta !== 'undefined') ?
												$('<div />', { 'class': 'card-pf box border-color' })
												.append($('<h4 />', { 'class': 'box-header text-center', text: 'Acta Designación de Autoridades' }))
													.append(
														(item.acta.length !== 0) ?
															$('<div />', { 'class': 'box-body' })
															.append(
																$.map(item.acta, function(mapActa, indexActa) {
																	var fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapActa.filename, text: mapActa.title || mapActa.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
																	var missingFile = $('<div />', { text: 'Falta Archivo' });
																	return (typeof mapActa !== 'undefined' && typeof mapActa.file !== 'undefined') ?
																		fileuploaded
																	:
																		$.map(mapActa, function(mapActaSub, indexActaSub) {
																			fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapActaSub.filename, text: mapActaSub.title || mapActaSub.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
																			return (typeof mapActaSub !== 'undefined' && typeof mapActaSub.file !== 'undefined') ?
																				fileuploaded
																			:
																				missingFile
																		})
																})
															)
														:
															''
													) 
												.append(
													(item.acta.expiration !== null) ?
														$('<div />', { 'class': 'box-footer text-center' })
														.append($('<p />')
															.append($('<strong />', { text: 'Vencimiento' }))
														)
														.append($('<p />')
															.append($('<span />', { text: item.acta.expiration }))
														)
													: ''
													)
												: $('<div />', { 'class': 'card-pf box border-color' })
												.append($('<h4 />', { 'class': 'box-header text-center', text: 'Acta Designación de Autoridades' }))
												.append($('<div />', { 'class': 'box-footer text-center' })
													.append($('<div />', { 'class': 'ui primary', text: 'Falta Archivo' }))
												)
										) // End If
									)
									.append($('<div />', { 'class': 'col-md-4' })
										.append(
											(typeof item !== 'undefined' && typeof item.fideicomiso !== 'undefined') ?
												$('<div />', { 'class': 'card-pf box border-color' })
												.append($('<h4 />', { 'class': 'box-header text-center', text: 'Contrato de Fideicomiso' }))
													.append(
														(item.fideicomiso.length !== 0) ?
															$('<div />', { 'class': 'box-body' })
															.append(
																$.map(item.fideicomiso, function(mapFideicomiso, indexFideicomiso) {
																	var fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFideicomiso.filename, text: mapFideicomiso.title || mapFideicomiso.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
																	var missingFile = $('<div />', { text: 'Falta Archivo' });
																	return (typeof mapFideicomiso !== 'undefined' && typeof mapFideicomiso.file !== 'undefined') ?
																		fileuploaded
																	:
																		$.map(mapFideicomiso, function(mapFideicomisoSub, indexFideicomisoSub) {
																			fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFideicomisoSub.filename, text: mapFideicomisoSub.title || mapFideicomisoSub.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
																			return (typeof mapFideicomisoSub !== 'undefined' && typeof mapFideicomisoSub.file !== 'undefined') ?
																				fileuploaded
																			:
																				missingFile
																		})
																})
															)
														:
															''
													) 
												.append(
													(item.fideicomiso.expiration !== null) ?
														$('<div />', { 'class': 'box-footer text-center' })
														.append($('<p />')
															.append($('<strong />', { text: 'Vencimiento' }))
														)
														.append($('<p />')
															.append($('<span />', { text: item.fideicomiso.expiration }))
														)
													: ''
													)
												: $('<div />', { 'class': 'card-pf box border-color' })
												.append($('<h4 />', { 'class': 'box-header text-center', text: 'Contrato de Fideicomiso' }))
												.append($('<div />', { 'class': 'box-footer text-center' })
													.append($('<div />', { 'class': 'ui primary', text: 'Falta Archivo' }))
												)
										) // End If
									)
									.append($('<div />', { 'class': 'col-md-4' })
										.append(
											(typeof item !== 'undefined' && typeof item.gestion !== 'undefined') ?
												$('<div />', { 'class': 'card-pf box border-color' })
												.append($('<h4 />', { 'class': 'box-header text-center', text: 'Poder de Gestión' }))
													.append(
														(item.gestion.length !== 0) ?
															$('<div />', { 'class': 'box-body' })
															.append(
																$.map(item.gestion, function(mapGestion, indexGestion) {
																	var fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapGestion.filename, text: mapGestion.title || mapGestion.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
																	var missingFile = $('<div />', { text: 'Falta Archivo' });
																	return (typeof mapGestion !== 'undefined' && typeof mapGestion.file !== 'undefined') ?
																		fileuploaded
																	:
																		$.map(mapGestion, function(mapGestionSub, indexGestionSub) {
																			fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapGestionSub.filename, text: mapGestionSub.title || mapGestionSub.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
																			return (typeof mapGestionSub !== 'undefined' && typeof mapGestionSub.file !== 'undefined') ?
																				fileuploaded
																			:
																				missingFile
																		})
																})
															)
														:
															''
													) 
												.append(
													(item.gestion.expiration !== null) ?
														$('<div />', { 'class': 'box-footer text-center' })
														.append($('<p />')
															.append($('<strong />', { text: 'Vencimiento' }))
														)
														.append($('<p />')
															.append($('<span />', { text: item.gestion.expiration }))
														)
													: ''
													)
												: $('<div />', { 'class': 'card-pf box border-color' })
												.append($('<h4 />', { 'class': 'box-header text-center', text: 'Poder de Gestión' }))
												.append($('<div />', { 'class': 'box-footer text-center' })
													.append($('<div />', { 'class': 'ui primary', text: 'Falta Archivo' }))
												)
										) // End If
									)
									.append($('<div />', { 'class': 'col-md-4' })
										.append(
											(typeof item !== 'undefined' && typeof item.balance !== 'undefined') ?
												$('<div />', { 'class': 'card-pf box border-color' })
												.append($('<h4 />', { 'class': 'box-header text-center', text: 'Balance General' }))
													.append(
														(item.balance.length !== 0) ?
															$('<div />', { 'class': 'box-body' })
															.append(
																$.map(item.balance, function(mapBalance, indexBalance) {
																	var fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapBalance.filename, text: mapBalance.title || mapBalance.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
																	var missingFile = $('<div />', { text: 'Falta Archivo' });
																	return (typeof mapBalance !== 'undefined' && typeof mapBalance.file !== 'undefined') ?
																		fileuploaded
																	:
																		$.map(mapBalance, function(mapBalanceSub, indexBalanceSub) {
																			fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapBalanceSub.filename, text: mapBalanceSub.title || mapBalanceSub.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
																			return (typeof mapBalanceSub !== 'undefined' && typeof mapBalanceSub.file !== 'undefined') ?
																				fileuploaded
																			:
																				missingFile
																		})
																})
															)
														:
															''
													) 
												.append(
													(item.balance.expiration !== null) ?
														$('<div />', { 'class': 'box-footer text-center' })
														.append($('<p />')
															.append($('<strong />', { text: 'Vencimiento' }))
														)
														.append($('<p />')
															.append($('<span />', { text: item.balance.expiration }))
														)
													: ''
													)
												: $('<div />', { 'class': 'card-pf box border-color' })
												.append($('<h4 />', { 'class': 'box-header text-center', text: 'Balance General' }))
												.append($('<div />', { 'class': 'box-footer text-center' })
													.append($('<div />', { 'class': 'ui primary', text: 'Falta Archivo' }))
												)
										) // End If
									)
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
	**				Begin Init Company
	**************************************************/
	initController: function (mode) {
		var self = this;

		// $.each(self.collection, function (i, item) {
		// 	self.generate($('.company' + mode), i, item);
		// });
		self.populate();
		main.overlay.hide();
	},
	/**************************************************
	**				End Init Company
	**************************************************/
	/**************************************************
	**        Begin get tarifas
	**************************************************/
	getTarifas: function (tarifa_id, company, linea) {
		var self = this;
		var compid = company;
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
	registerCompany: function (adminId) {
		var self = this;
		var mode = 'register';

		if (self.mode == 'edit') {
			var edit_id = window.location.pathname;
			mode = 'update/' + edit_id.substring(edit_id.lastIndexOf('/')+1);
		} else {
			mode = 'register';
		}

		var companyRegArr = $('form#companyForm').serializeArray();
		if (typeof adminId !== 'undefined') {
			companyRegArr.push({ name: 'admin_id', value: adminId});
		}

		$.each($('.actions'), function (i, item) {
			var selectedOptions = [];
			$.each($('.dropdown.multiple a', item), function (index, element) {
				var action = $(this).attr('data-value');
				selectedOptions.push(action);
			});
			// $('input', item).val(selectedOptions);
			companyRegArr.push({ name: 'staff_actions', value: selectedOptions});
		});

		$.ajax({
			url: "/company/" + mode,
			type:"POST",
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: companyRegArr,
			success:function(data){
				console.log('success');
				console.log(data);
				window.location.href = '/company';
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
		// 	self.registerCompany();

		// });
	},
	/**************************************************
	**        End submit
	**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var company = new Company();
