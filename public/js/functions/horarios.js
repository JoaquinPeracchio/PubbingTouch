	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Horario = function () {

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
			this.$horariostart = this.$rangestart.find('#horariostart');
		this.$rangeend = this.$form.find('#rangeend');
			this.$horariosend = this.$rangeend.find('#horariosend');

		this.$inputSector = this.$form.find('#parent');
		this.$parent = this.$form.find('.parent');
		this.$tableStatus = this.$form.find('.tableStatus');

		this.$draggableArea = this.$form.find('#draggableArea');
			this.$tableItem = $(document).find('.tableItem');
			this.$available = $(document).find('.tableItem.available');

		this.$reservedTable = this.$form.find('#reserved_table');

		this.$reservedBy = this.$form.find('#reserved_by');

	this.$content = $('#content');
	// Horario Page
		this.$horariosFilter = this.$content.find('.horariosFilter');
			this.$horariosSortSelect = this.$horariosFilter.find('select');
			this.$horariosSortBy = this.$horariosFilter.find('.sortBy');
			this.$horariosSortOrder = this.$horariosFilter.find('.sortOrder');
			this.$horariosFilterString = this.$horariosFilter.find('.stringFilter')
		this.$horariosList = this.$content.find('.horarioslist');

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.mode = this.$body.data('mode');

	this.access_token = window.localStorage.getItem('access_token');

	this.controller = 'horarios';

	this.parentCompany;
	this.titlename;
	this.parentLinea;
	this.number;

	this.horarioControlador;

	this.tarifas;

	this.tarifasIds = [];
	this.currentTarifa;

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

Horario.prototype = {
	init: function () {
		var self = this;

		self.submit();
	},
	/**************************************************
	**        Begin get horarios
	**************************************************/
	getRelated: function (companyID, linea) {
		var self = this;
		var compid = companyID;
		var lineaID = linea;

		$.ajax({
			url: "/horarios/related",
			type:"POST",
			async: false,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: {
				parent: linea
			}
		}).done(function( data ) {
			console.log(data);
			self.collection = data.collection;
			var key = 'horarios-' + lineaID;
			if (Array.isArray(self.collection) && self.collection.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(self.collection));
				var tarifaFlag = false;
				$.each(self.collection, function(i, item){
					if (typeof item.tarifa_id !== 'undefined') {
						$.each(self.tarifasIds, function(tarifaI, tarifaEl){
							console.log(tarifaEl.tarifa_id);
							if(tarifaEl.tarifa_id == item.tarifa_id) {
								console.log('true');
								tarifaFlag = true;
								return false;
							} else {
								tarifaFlag = false;
								console.log('false');
							}
						});
						if (!tarifaFlag) {
							self.getTarifas(item.tarifa_id, compid, index);
						}
					}
				});
				main.functionsObj['horarios'] = horarios;
			}
			// window.localStorage.setItem('horarios', JSON.stringify(self.collection));
			// var compid = main.getIndex(company.collection, companyID)
			// var index = company.collection[compid].lineas.findIndex(lineaEl => lineaEl._id === lineaID);
			// console.log(index);
			// 	if (typeof company.collection[compid].lineas !== 'undefined') {
			// 		company.collection[compid].lineas[index] = Object.assign({'horarios': self.collection}, company.collection[compid].lineas[index])
			// 	}
			// self.generate(selector, index, compid, linea);
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
		});
	},
	/**************************************************
	**        End get Horarios
	**************************************************/
	/**************************************************
	**        Begin Generate Tabs
	**************************************************/
	generateTabs: function (element, companyID) {
		var self = this;

		element.prepend(
		$('<div />', { 'class': 'box-body align-center' })
			.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/horarios/registercontrolador', text: 'Agregar Controlador' }))
			.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/horarios/register', text: 'Agregar Horario' }))
		)
	},
	/**************************************************
	**        End Generate Tabs
	**************************************************/
	/**************************************************
	**        Begin Generate horarios
	**************************************************/
	generate: function (element, companyID, lineaID, item) {
		var self = this;
		self.parentCompany = item.parent;
		// item = self.parentCompany.lineas[main.getIndex(lineas.collection, lineaID)];
		var selector;

		// Begin Array
		if (!element) {
			var element = element.closest('ul').siblings('.tab-content').find('#ramales-' + companyID);
		}

		item.tipohorario = item.tipohorario || '';
		item.status = item.status || 'Controlador';
		var color;
		var fileTitle;
		(item.status == 'aprovado') ? color = 'green' : (item.status == 'rechazado') ? color = 'red' : (item.status == 'Controlador') ? color = 'blue' : (item.status == 'presentado') ? color = 'grey' : color = 'yellow';

		(item.register_type != 'controlador' && typeof item.register_type !== 'undefined') ?

		element.append($('<div />', { 'class': 'box border-color' })
			.append($('<div />', { 'class': 'box-body no-padding text-center' })
				.append(
					// $.map(item.horarios, function(mapHorario, indexHorario) {
							$('<div />', { 'class': 'col-md-6' })
							.append($('<div />', {'class': 'box border-color'})
								.append($('<div />', {'class': 'box-header'})
									.append($('<a />', { 'class': 'ui ' + color + ' ribbon label', text: main.toCamelCase(item.status) }))
									.append($('<h3 />', { text: 'Horario ' + item.tipohorario }))
									.append($('<div />', { 'class': 'box-tools pull-right' })
										.append($('<a />', { 'class': 'btn btn-box-tool', 'href': '/horarios/edit/' + item._id })
											.prepend($('<i />', { 'class': 'fa fa-pencil' }))
										)
										.append($('<button />', { 'class': 'btn btn-box-tool btnDelete', 'data-collection': 'horarios', 'data-compid': item._id })
											.prepend($('<i />', { 'class': 'fa fa-remove' }))
										)
									)
								)
								.append(
									(item.files.length !== 0) ?
										$('<div />', { 'class': 'box-body' })
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
						// .append(
						// 	$.map(item.files, function(mapFile, indexFile) {
						// 		var fileTitle;
						// 		(typeof mapFile.title !== 'undefined') ? fileTitle = mapFile.title : fileTitle = mapFile.file;
						// 		return (typeof mapFile !== 'undefined') ?
						// 			$('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFile.filename, text: fileTitle })
						// 				.prepend($('<i />', { 'class': 'fa fa-file' }))
						// 		: $('<div />', { text: 'Falta Archivo' })
						// 	})
						// )
						.append($('<p />', { 'class': 'text-muted', text: item.comment }))
						.append(
							(typeof item.expiration !== 'undefined') ?
							$('<div />', { 'class': 'expiration badge bg-red', text: item.expiration })
								.prepend($('<span />', { text: 'Vencimiento: ' }))
								.prepend($('<i />', { 'class': 'fa fa-calendar-times-o' }))
							: ''
						)
									:
										''
								) 
							) // End Segment
					// })
				)
			)
		)
		: self.horarioControlador = item

		if (typeof self.horarioControlador !== 'undefined') {
			element.append($('<div />', { 'class': 'box-body no-padding text-center' })
			.prepend($('<div />', { 'class': 'col-md-12' })
				.append($('<div />', {'class': 'box border-color'})
					.append($('<div />', {'class': 'box-header'})
						.append($('<a />', { 'class': 'ui blue ribbon label', text: main.toCamelCase('Controlador') }))
						.append($('<h3 />', { text: 'Controlador' }))
						.append($('<div />', { 'class': 'box-tools pull-right' })
							.append($('<a />', { 'class': 'btn btn-box-tool', 'href': '/horarios/edit/controlador/' + self.horarioControlador._id })
								.prepend($('<i />', { 'class': 'fa fa-pencil' }))
							)
							.append($('<button />', { 'class': 'btn btn-box-tool btnDelete', 'data-collection': 'horarios', 'data-compid': self.horarioControlador._id })
								.prepend($('<i />', { 'class': 'fa fa-remove' }))
							)
						)
					)
					.append(
						(typeof self.horarioControlador !== 'undefined' && self.horarioControlador.files.length !== 0) ?
							$('<div />', { 'class': 'box-body' })
								.append($('<div />', { 'class': 'row cards' })
											.append(
											(self.horarioControlador.files.length !== 0) ?
												$.map(self.horarioControlador.files, function(mapFile, indexFile) {
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
								)
						// .append(
						// 	$.map(item.files, function(mapFile, indexFile) {
						// 		var fileTitle;
						// 		(typeof mapFile.title !== 'undefined') ? fileTitle = mapFile.title : fileTitle = mapFile.file;
						// 		return (typeof mapFile !== 'undefined') ?
						// 			$('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapFile.filename, text: fileTitle })
						// 				.prepend($('<i />', { 'class': 'fa fa-file' }))
						// 		: $('<div />', { text: 'Falta Archivo' })
						// 	})
						// )
						.append($('<p />', { 'class': 'text-muted', text: item.comment }))
						.append(
							(typeof item.expiration !== 'undefined') ?
							$('<div />', { 'class': 'expiration badge bg-red', text: item.expiration })
								.prepend($('<span />', { text: 'Vencimiento: ' }))
								.prepend($('<i />', { 'class': 'fa fa-calendar-times-o' }))
							: ''
						)
						:
							''
					) 
				) // End Segment
			) // End Segment
		)
		}

	},
	/**************************************************
	**        End Generate Horarios
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

		// 	self.registerHorario();

		// });
	},
	/**************************************************
	**        End submit
	**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var horarios = new Horario();
