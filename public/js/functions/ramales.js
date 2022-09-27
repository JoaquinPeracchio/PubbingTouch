	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Ramal = function () {

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
			this.$ramalestart = this.$rangestart.find('#ramalestart');
		this.$rangeend = this.$form.find('#rangeend');
			this.$ramalesend = this.$rangeend.find('#ramalesend');

		this.$inputSector = this.$form.find('#parent');
		this.$parent = this.$form.find('.parent');
		this.$tableStatus = this.$form.find('.tableStatus');

		this.$draggableArea = this.$form.find('#draggableArea');
			this.$tableItem = $(document).find('.tableItem');
			this.$available = $(document).find('.tableItem.available');

		this.$reservedTable = this.$form.find('#reserved_table');

		this.$reservedBy = this.$form.find('#reserved_by');

	this.$content = $('#content');
	// Ramal Page
		this.$ramalesFilter = this.$content.find('.ramalesFilter');
			this.$ramalesSortSelect = this.$ramalesFilter.find('select');
			this.$ramalesSortBy = this.$ramalesFilter.find('.sortBy');
			this.$ramalesSortOrder = this.$ramalesFilter.find('.sortOrder');
			this.$ramalesFilterString = this.$ramalesFilter.find('.stringFilter')
		this.$ramalesList = this.$content.find('.ramaleslist');

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.mode = this.$body.data('mode');

	this.access_token = window.localStorage.getItem('access_token');

	this.controller = 'ramales';
	this.collection;

	this.parentCompany;
	this.titlename;
	this.parentLinea;
	this.number;

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

	this.kml;

	this.init();
};

Ramal.prototype = {
	init: function () {
		var self = this;

		self.submit();
	},
	/**************************************************
	**        Begin get ramales
	**************************************************/
	getRelated: function (companyID, lineaID) {
		var self = this;
		var compid = companyID;
		var lineaID = lineaID;

		$.ajax({
			url: "/ramales/related",
			type:"POST",
			async: false,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: {
				parent: lineaID
			}
		}).done(function( data ) {
			console.log(data);
			self.collection = data.collection;
			var key = 'ramales-' + lineaID;
			if (Array.isArray(self.collection) && self.collection.length != 0) {
				window.localStorage.setItem([key], JSON.stringify(self.collection));
			}
			main.functionsObj['ramales'] = ramales;
			// self.generate(element, index, lineaid, compid);
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
		});
	},
	/**************************************************
	**        End get Ramales
	**************************************************/
	/**************************************************
	**        Begin Generate Tabs
	**************************************************/
	generateTabs: function (element, companyID) {
		var self = this;

		element.prepend(
		$('<div />', { 'class': 'box-body align-center' })
			.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/ramales/register', text: 'Agregar Ramal' }))
		)
	},
	/**************************************************
	**        End Generate Tabs
	**************************************************/
	/**************************************************
	**        Begin Generate ramales
	**************************************************/
	generate: function (element, companyID, lineaID, item) {
		var self = this;
		var parentCompany = item.parent;
		var parentLinea = item.parent_linea;
		var tarifaFlag = false;

		if (!element) {
			var element = element.closest('ul').siblings('.tab-content').find('#ramales-' + companyID);
		}

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
				self.getTarifas(item.tarifa_id, companyID);
			}
		}

		// Begin Array
				// Make sure item is not empty
				item = item || [];
				item.cabecera = item.cabecera || [];
				item.terminal = item.terminal || [];
				item.recorrido = item.recorrido || [];
				item.recorrido.ida = item.recorrido.ida || [];
				item.recorrido.vuelta = item.recorrido.vuelta || [];
				self.currentTarifa = self.tarifasIds.find(tarifa => tarifa.tarifa_id === item.tarifa_id);
				var kmAcumulado = 0;
				var negative = 0;
				var selectedTarifa = -1;
				// return $('<div />', { 'class': 'empty' })
				// Begin Dropdown Title
		element.append(
			// $.map(parentLinea.ramales, function(item, indexRamal) {
				$('<div />', { 'class': 'panel box border-color box-profile title ramalid' + item._id })
					.append($('<div />', { 'class': 'box-tools pull-right' })
						.append($('<a />', { 'href': '/ramales/edit/' + item._id, 'class': 'btn btn-box-tool' })
							.append($('<i />', { 'class': 'fa fa-pencil'}))
						)
						.append($('<a />', { 'class': 'btn btn-box-tool btn-delete', 'data-toggle': 'modal', 'data-target': '#myModal', 'data-collection': 'ramales', 'data-id': item._id })
							.append($('<i />', { 'class': 'fa fa-remove'}))
						)
					)
					.append($('<a />', { 'class': 'accordion collapsed', 'data-toggle': 'collapse', 'data-parent': '#accordion', 'aria-expanded': false, 'href': '#ramalid' + item._id })
						.append($('<span />', { 'class': 'pull-left img-responsive', 'style': 'text-align: center; font-size: 45px;' })
							.append($('<i />', { 'class': 'fa fa-bus' }))
						)
						.append($('<div />')
							.append($('<h3 />', { 'class': 'profile-username text-center capitalize', text: 'Ramal ' + item.titlename.toUpperCase() }))
							// .append($('<p />', { 'class': 'text-muted text-center', text: item.direccion }))
							// .append($('<p />', { 'class': 'text-muted text-center', text: item.telefono }))
						)
						.append($('<hr />', { 'class': 'clear' }))
					)
					.append($('<div />', { 'class': 'panel-collapse collapse', 'id': 'ramalid' + item._id, 'aria-expanded': false })
						.append($('<div />', { 'class': 'box-body no-padding' })
							.append($('<div />', { 'class': 'nav-tabs-custom' })
								.append($('<ul />', { 'class': 'nav nav-tabs' })
									.append($('<li />')
										.append($('<a />', { 'class': 'active', 'href': '#registros-' + item._id, 'data-toggle': 'tab', text: 'Registros' })
											// .append($('<span />', { 'class': 'pull-right badge bg-blue', text: '12' }))
										)
									)
									.append($('<li />')
										.append($('<a />', { 'class': 'tabTarifa empty', 'href': '#tarifas-' + item._id, 'data-toggle': 'tab', text: 'Tarifas', 'data-id': item._id }))
									)
									.append($('<li />')
										.append($('<a />', { 'class': 'tabDesvio empty', 'href': '#desvios-' + item._id, 'data-toggle': 'tab', text: 'Desvios', 'data-id': item._id }))
									)
									.append($('<li />')
										.append($('<a />', { 'class': 'tabProyecto empty', 'href': '#proyectos-' + item._id, 'data-toggle': 'tab', text: 'Proyectos', 'data-id': item._id }))
									)
								)
								.append($('<div />', { 'class': 'tab-content' })
									.append($('<div />', { 'class': 'tab-pane active', 'id': 'registros-' + item._id })
										.append($('<div />', { 'class': 'row' })
											.append($('<div />', { 'class': 'col-md-12' })
												.append($('<div />', { 'class': 'box box-success' })
													.append($('<div />', { 'class': 'box-header' })
														.append($('<h3 />', { 'class': 'box-title', text: '(Registrado en CNRT) - Formulario E' }))
														// .append($('<div />', { 'class': 'box-tools pull-right' })
														// 	.append($('<button />', { 'class': 'btn btn-box-tool', 'data-widget': 'collapse' })
														// 		.prepend($('<i />', { 'class': 'fa fa-minus' }))
														// 	)
														// )
													)
													.append($('<div />', { 'class': 'box-body no-padding table-responsive no-padding' })
														// Begin Table
														.append($('<table />', { 'class': 'table table-hover' })
															.append($('<thead />', {})
																.append($('<tr />', {})
																	.append($('<th />', { 'colspan': '2', text: 'Modalidad:' }))
																	.append($('<th />', { 'colspan': '2', text: 'Servicio Público Provincial' }))
																)
															)
															.append($('<tbody />', {})
																.append($('<tr />', {})
																	.append($('<td />', { text: 'Cabecera de Origen' }))
																	.append($('<td />', { text: item.cabecera}))
																	.append($('<td />', { text: 'Cabecera de Destino' }))
																	.append($('<td />', { text: item.terminal}))
																)
																.append($('<tr />', {})
																	.append($('<td />', { 'colspan': '2', text: 'Por:' }))
																	.append($('<td />', { 'colspan': '2', text: '' }))
																)
																.append($('<tr />', {})
																	.append($('<td />', { text: 'Itinerario de ida' }))
																	.append($('<td />', { text: item.recorrido.ida}))
																	.append($('<td />', { text: 'Itinerario de vuelta' }))
																	.append($('<td />', { text: item.recorrido.vuelta}))
																)
																.append($('<tr />', {})
																	.append($('<td />', { 'colspan': '2', text: 'Tipo de servicio::' }))
																	.append($('<td />', { 'colspan': '2', text: 'Urbano Provincial' }))
																)
															)
														) // End Table
													)
												)
											)
											.append($('<div />', { 'class': 'col-md-12' })
												.append($('<div />', { 'class': 'box box-success' })
													.append($('<div />', { 'class': 'box-header' })
														.append($('<h3 />', { 'class': 'box-title', text: 'Formulario F' }))
														// .append($('<div />', { 'class': 'box-tools pull-right' })
														// 	.append($('<button />', { 'class': 'btn btn-box-tool', 'data-widget': 'collapse' })
														// 		.prepend($('<i />', { 'class': 'fa fa-minus' }))
														// 	)
														// )
													)
													.append($('<div />', { 'class': 'box-body no-padding table-responsive no-padding' })
														// Begin Table
														.append($('<table />', { 'class': 'table table-hover' })
															.append($('<thead />', {})
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Empresa:' }))
																	.append($('<th />', { 'colspan': '3', text: parentCompany.titlename }))
																)
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Línea:' }))
																	.append($('<th />', { 'colspan': '3', text: parentLinea.number }))
																)
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Recorrido  Ramal ' + item.titlename.toUpperCase() + ' :' }))
																	.append($('<th />', { 'colspan': '3', text: item.recorrido }))
																)
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Tarifa:' }))
																	.append($('<th />', { 'colspan': '3', text: item.titlename }))
																)
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Sección' }))
																	.append($('<th />', {}))
																	.append($('<th />', { text: 'Parcial' }))
																	.append($('<th />', { text: 'Km Acumulado' }))
																)
															)
															.append($('<tbody />', {})
																.append($('<tr />', {})
																	.append($('<td />', { text: 'Origen' }))
																	.append($('<td />', { text: item.cabecera }))
																	.append($('<td />', {}))
																	.append($('<td />', {}))
																)
																// Begin Array
																.append(
																	$.map(item.sections, function(mapSeccion, indexSeccion) {
																		kmAcumulado += Number(mapSeccion.parcial);
																		// Begin Dropdown Title
																		return $('<tr />', {})
																			.append($('<td />', { text: 'Seccion ' + mapSeccion.order }))
																			.append($('<td />', { text: mapSeccion.name }))
																			.append($('<td />', { text: mapSeccion.parcial }))
																			.append($('<td />', { text: kmAcumulado.toFixed(2) }))
																	})
																)
															)
														) // End Table
													)
												)
											)
										)
										.append($('<div />', { 'class': 'row cards', text: 'Documentos' })
											.append($('<div />', { 'class': 'row cards' })
											)
										)
									)
									.append($('<div />', { 'class': 'tab-pane', 'id': 'tarifas-' + item._id })
										.append($('<div />', { 'class': 'row' })
											.append($('<div />', { 'class': 'col-md-12' })
												.append($('<div />', { 'class': 'box box-success' })
													.append($('<div />', { 'class': 'box-header' })
														.append($('<h3 />', { 'class': 'box-title', text: 'Cuadro Tarifario' })
															.append($('<small />', { text: ' - Tarifa con SUBE' }))
														)
														// .append($('<div />', { 'class': 'box-tools pull-right' })
														// 	.append($('<button />', { 'class': 'btn btn-box-tool', 'data-widget': 'collapse' })
														// 		.prepend($('<i />', { 'class': 'fa fa-minus' }))
														// 	)
														// )
													)
													.append($('<div />', { 'class': 'box-body no-padding table-responsive no-padding' })
														// Begin Table
														.append($('<table />', { 'class': 'table table-hover' })
															.append($('<thead />', {})
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Razon Social:' }))
																	.append($('<th />', { 'colspan': '3', text: parentCompany.titlename }))
																)
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Línea:' }))
																	.append($('<th />', { 'colspan': '3', text: parentLinea.number }))
																)
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Recorrido  Ramal ' + item.titlename.toUpperCase() + ' :' }))
																	.append($('<th />', { 'colspan': '3', text: item.recorrido }))
																)
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Tarifa:' }))
																	.append($('<th />', { 'colspan': '3', text: item.titlename }))
																)
															)
														)
														.append($('<table />', { 'class': 'table table-hover' })
															.append($('<thead />', {})
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Parcial' }))
																	.append($('<th />', {}))
																	// Begin Array
																	.append(
																		$.map(item.sections, function(mapSeccion, indexSeccion) {
																			// Begin Dropdown Title
																			return $('<th />', { text: mapSeccion.parcial })
																		})
																	)
																)
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Km Acum.' }))
																	.append($('<th />', {}))
																	// Begin Array
																	.append(
																		$.map(item.sections, function(mapSeccion, indexSeccion) {
																			(indexSeccion == 0) ? kmAcumulado = 0 : '';
																			kmAcumulado += Number(mapSeccion.parcial);
																			// Begin Dropdown Title
																			return $('<th />', { text: kmAcumulado.toFixed(2) })
																		})
																	)
																)
																.append($('<tr />', {})
																	.append($('<th />', { text: 'Seccion' }))
																	.append($('<th />', { text: item.cabecera }))
																	// Begin Array
																	.append(
																		$.map(item.sections, function(mapSeccion, indexSeccion) {
																			// Begin Dropdown Title
																			return $('<th />', { text: mapSeccion.name })
																		})
																	)
																)
															)
															.append($('<tbody />', {})
																.append($('<tr />', {})
																	.append($('<th />', { text: item.cabecera }))
																	.append($('<td />', { 'class': 'negative' }))
																	// Begin Array
																	.append(
																		$.map(item.sections, function(mapSeccion, indexSeccion) {
																			if (typeof item.tarifavalues[0] !== 'undefined' && typeof self.currentTarifa.tarifa_obj[0] !== 'undefined') {
																				var sectionTarifa = item.tarifavalues[0].values.split(',');
																				// Begin Dropdown Title
																				if (sectionTarifa != "") {
																					return $('<td />', { text: self.currentTarifa.tarifa_obj[0].cuadro_tarifario[sectionTarifa[indexSeccion]].price })
																				} else {
																					return $('<td />', { text: 'Falta' })
																				}
																			} else {
																				return $('<td />', { text: 'Falta' })
																			}
																		})
																	)
																)
																// Begin Array
																.append(
																	$.map(item.sections, function(mapSeccion, indexSeccion) {
																		negative += 1;
																		selectedTarifa = Number(-1);
																		var assignedTarifa = Number(-1);
																		// Begin Dropdown Title
																		return $('<tr />', { 'class': 'tarifaValues'})
																		.append($('<th />', { text: mapSeccion.name }))
																		.append($('<td />', { 'class': 'negative' }))
																		// Begin Array
																		.append(
																			$.map(item.sections, function(mapSec, indexSec) {
																				if (indexSec < negative) {
																					return $('<td />', { 'class': 'negative' })
																				} else {
																					if (typeof item.tarifavalues[indexSeccion] !== 'undefined' && typeof self.currentTarifa.tarifa_obj[0] !== 'undefined') {
																						var sectionTarifa = item.tarifavalues[indexSeccion].values.split(',');
																						// Begin Dropdown Title
																						assignedTarifa = Number(assignedTarifa + 1);
																						if (sectionTarifa != "") {
																							return $('<td />', { text: self.currentTarifa.tarifa_obj[0].cuadro_tarifario[sectionTarifa[assignedTarifa]].price })
																						} else {
																							return $('<td />', { text: 'Falta' })
																						}
																					} else {
																						return $('<td />', { text: 'Falta' })
																					}
																				}
																			})
																		)
																	})
																)
															)
														)
													)
												)
											)
										)
									)
									.append($('<div />', { 'class': 'tab-pane', 'id': 'desvios-' + item._id })
										.append($('<div />', { 'class': 'row cards', text: 'Desvios' })
										)
									)
									.append($('<div />', { 'class': 'tab-pane', 'id': 'proyectos-' + item._id })
										.append($('<div />', { 'class': 'row cards', text: 'Proyectos' })
										)
									)
								)
							)
						)
					)
			// })
		); // End Array

	},
	/**************************************************
	**        End Generate Ramales
	**************************************************/
	/**************************************************
	**        Begin Get Tarifas
	**************************************************/
	getTarifas: function (tarifa_id, company) {
		var self = this;
		var compid = company;

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
				// self.companies[compid].lineas[lineaid] = Object.assign({'tarifa': self.tarifas}, self.tarifasIds);
				self.tarifasIds.push({
					'tarifa_id': tarifa_id,
					'tarifa_obj': self.tarifas
				});
				console.log(self.tarifas);
				// console.log(indexLinea);
				// console.log(index);
				// if (typeof self.companies[index].lineas !== 'undefined') {
				// 	self.companies[index].lineas[indexLinea] = Object.assign({'ramales': self.collection}, self.companies[index].lineas[indexLinea])
				// }
			}
		}).fail(function() {
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
		});
	},
	/**************************************************
	**        End Get Tarifas
	**************************************************/
	/**************************************************
	**        Begin get tarifas
	**************************************************/
	relatedTarifa: function (tarifa_id) {
		var self = this;

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
			self.tarifaRelated = data.collection;
			// var tarifaId = self.tarifas[0]._id;
			// 	// self.tarifasIds = Object.assign({'tarifa': self.tarifas}, self.tarifasIds);
			// 	self.tarifasIds.push({
			// 		'tarifa_id': tarifa_id,
			// 		'tarifa_obj': self.tarifas
			// 	});
				console.log(self.tarifaRelated);
			self.updateSections();
			self.appendTarifa();
				// console.log(indexLinea);
				// console.log(index);
				// if (typeof self.companies[index].lineas !== 'undefined') {
				// 	self.companies[index].lineas[indexLinea] = Object.assign({'ramales': self.ramales}, self.companies[index].lineas[indexLinea])
				// }
		}).fail(function() {
			self.removeToken();
			self.initLogin();
			self.$loader.hide();
		});
	},
	/**************************************************
	**        End get Lineas
	**************************************************/
	/**************************************************
	**        Start submit
	**************************************************/
	appendTarifa: function (title, section) {
		var self = this;
		var negative = 0;
		var selectedTarifa = -1;


		$('.assignTarifa').empty();
		$('.assignTarifa').append(
			// $.map(self.sections, function(mapRamal, indexRamal) {
			// 	var kmAcumulado = 0;
			// 	// Begin Dropdown Title
			// 	return $('<div />', { 'class': 'empty' })
			// 	// Begin Dropdown Title
				$('<div />', { 'class': 'card-pf box border-color' })
					.append($('<div />', { 'class': 'box-header text-center' })
						.append($('<p />', { 'class': 'no-margin capitalize sections_label', text: 'Tarifa con SUBE' }))
					)
					.append($('<div />', { 'class': 'box-body btn no-margin fc-grid text-center capitalize' })
						// Begin Table
						.append($('<table />', { 'class': 'table table-hover' })
							.append($('<thead />', {})
								.append($('<tr />', {})
									.append($('<th />', { text: 'Parcial' }))
									.append($('<th />', {}))
									// Begin Array
									.append(
										$.map(self.sections, function(mapSeccion, indexSeccion) {
											// Begin Dropdown Title
											return $('<th />', { text: mapSeccion.parcial })
										})
									)
								)
								.append($('<tr />', {})
									.append($('<th />', { text: 'Km Acum.' }))
									.append($('<th />', {}))
									// Begin Array
									.append(
										$.map(self.sections, function(mapSeccion, indexSeccion) {
											(indexSeccion == 0) ? kmAcumulado = 0 : '';
											kmAcumulado += Number(mapSeccion.parcial);
											// Begin Dropdown Title
											return $('<th />', { text: kmAcumulado.toFixed(2) })
										})
									)
								)
								.append($('<tr />', {})
									.append($('<th />', { text: 'Seccion' }))
									.append($('<th />', { text: self.cabecera }))
									// Begin Array
									.append(
										$.map(self.sections, function(mapSeccion, indexSeccion) {
											// Begin Dropdown Title
											return $('<th />', { text: mapSeccion.name })
										})
									)
								)
							)
							.append($('<tbody />', {})
								.append($('<tr />', { 'class': 'tarifaValues'})
									.append($('<th />', { text: self.cabecera }))
									.append($('<td />', { 'class': 'negative' }))
									// Begin Array
									.append(
										$.map(self.sections, function(mapSec, indexSec) {
											if (indexSec < negative || typeof self.tarifaRelated[0] === 'undefined') {
											// if (indexSec < negative) {
												return $('<td />', { 'class': 'negative' })
											} else {
												selectedTarifa += Number(1);
												return $('<td />', { 'class': '' })
												.append($('<select />', { 'class': 'form-control' })
													.append(
														$.map(self.tarifaRelated[0].cuadro_tarifario, function(mapTarifa, indexTarifa) {
															if (selectedTarifa == indexTarifa) {
																console.log('true');
																return $('<option />', { value: indexTarifa, text: mapTarifa.concept + 'Km - $' + mapTarifa.price , 'selected': 'selected'})
															} else {
																console.log('false');
																return $('<option />', { value: indexTarifa, text: mapTarifa.concept + 'Km - $' + mapTarifa.price })
															}
														})
													)
												)
											}
										})
									)
								)
								// Begin Array
								.append(
									$.map(self.sections, function(mapSeccion, indexSeccion) {
										negative += 1;
										selectedTarifa = Number(-1);
										// Begin Dropdown Title
										return $('<tr />', { 'class': 'tarifaValues'})
										.append($('<th />', { text: mapSeccion.name }))
										.append($('<td />', { 'class': 'negative' }))
										// Begin Array
										.append(
											$.map(self.sections, function(mapSec, indexSec) {
												if (indexSec < negative || typeof self.tarifaRelated[0] === 'undefined') {
													return $('<td />', { 'class': 'negative' })
												} else {
													selectedTarifa += Number(1);
													return $('<td />', { 'class': '' })
													.append($('<select />', { 'class': 'form-control' })
														.append(
															$.map(self.tarifaRelated[0].cuadro_tarifario, function(mapTarifa, indexTarifa) {
																if (selectedTarifa == indexTarifa) {
																	console.log('true');
																	return $('<option />', { value: indexTarifa, text: mapTarifa.concept + 'Km - $' + mapTarifa.price , 'selected': 'selected'})
																} else {
																	console.log('false');
																	return $('<option />', { value: indexTarifa, text: mapTarifa.concept + 'Km - $' + mapTarifa.price })
																}
															})
														)
													)
												}
											})
										)
									})
								)
						)
					)
				)
			// })
		);
	},
	/**************************************************
	**        End list
	**************************************************/
	/**************************************************
	**        Start Append Section
	**************************************************/
	appendSection: function (title, section) {
		var self = this;

		$('.sortable.sections')
		.append($('<li />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12 item' })
			.append($('<div />', { 'class': 'card-pf box border-color' })
				.append($('<div />', { 'class': 'box-header text-center' })
					.append($('<button />', { 'class': 'btn btn-box-tool btnDelete pull-right delete section' })
						.prepend($('<i />', { 'class': 'fa fa-remove' }))
					)
					.append($('<p />', { 'class': 'no-margin capitalize sections_label', text: section }))
				)
				.append($('<div />', { 'class': 'box-body btn no-margin fc-grid text-center capitalize' })
					.append($('<div />', { 'class': 'input-group' })
						.append($('<span />', { 'class': 'input-group-addon' })
							.prepend($('<i />', { 'class': 'fa fa-map-marker' }))
						)
						.append($('<input />', { 'class': 'sections_name form-control', 'placeholder': 'Seccion', 'type': 'text', 'name': 'sections_name', 'value': title }))
					)
				)

				.append($('<div />', { 'class': 'box-footer text-center' })
					.append($('<div />', { 'class': 'input-group' })
						.append($('<span />', { 'class': 'input-group-addon' })
							.prepend($('<i />', { 'class': 'fa fa-arrows-h' }))
						)
						.append($('<input />', { 'class': 'sections_parcial form-control', 'placeholder': 'Km Parcial', 'type': 'text', 'name': 'sections_parcial' }))
					)
				)
			)
			.append($('<input />', { 'class': 'sections_order', 'placeholder': 'Section', 'type': 'hidden', 'name': 'sections_order', 'value': section }))
		)

		// $('.sortable.sections').append(
		// 	$('<div />', { 'class': 'item' })
		// 	.prepend(
		// 		$('<i />', { 'class': 'delete red icon section' })
		// 	)
		// 	.append(
		// 		$('<label />', { 'class': 'sections_label', 'for': 'sections_name', text: section })
		// 	)
		// 	.append(
		// 		$('<div />', { 'class': 'ui input left icon' })
		// 		.prepend(
		// 			$('<i />', { 'class': 'map marker alternate icon' }))
		// 		.append(
		// 			$('<input />', { 'class': 'sections_name', 'placeholder': 'Seccion', 'type': 'text', 'name': 'sections_name', 'value': title })
		// 		)
		// 	)
		// 	.append(
		// 		$('<div />', { 'class': 'ui input left icon' })
		// 		.prepend(
		// 			$('<i />', { 'class': 'arrows alternate horizontal icon' }))
		// 		.append(
		// 			$('<input />', { 'class': 'sections_parcial', 'placeholder': 'Km Parcial', 'type': 'text', 'name': 'sections_parcial' })
		// 		)
		// 	)
		// 	.append(
		// 		$('<input />', { 'class': 'sections_order', 'placeholder': 'Section', 'type': 'hidden', 'name': 'sections_order', 'value': section })
		// 	)
		// )

		$('.sortable.sections .item input').off('focusout');
		$('.sortable.sections .item input').focusout(function(){
			self.updateSections();
		});
		$.each($('.sortable.sections .item'), function (i, item) {
			$('.sections_label', this).text('Seccion ' + ($(this).index() + 1));
			$('.sections_order', this).val(($(this).index() + 1));
		});

	},
	/**************************************************
	**        End Append Section
	**************************************************/
	/**************************************************
	**        Start submit
	**************************************************/
	updateSections: function () {
		var self = this;

		self.sections = [];
		$.each($('.sortable.sections .item'), function (i, item) {
			console.log(item.value);
			console.log(i);
			self.sections.push({
				name : $(this).find('.sections_name').val(),
				parcial : $(this).find('.sections_parcial').val(),
				order : $(this).find('.sections_order').val()
			});
		});
		self.cabecera = $('#cabecera').val();
		self.terminal = $('#terminal').val();

	},
	/**************************************************
	**        End list
	**************************************************/
	/**************************************************
	**        Start submit
	**************************************************/
	uploadKml: function (selector, formName, allLoaded) {
		var self = this;

		self.$loader.show();
		var dataForm = new FormData();
		$.each(selector[0].files, function(i, file) {
			dataForm.append('kmlFile', file);
		});

		$.ajax({
			url: '/upload/uploadkml',
			data: dataForm,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			method: 'POST',
			type: 'POST', // For jQuery < 1.9
			success: function(data) {
				console.log(data);
				$('.uploadedFiles').append('<input value="' + data.file.originalname + '" name="' + formName + '_name" type="hidden">' +
					'<input value="' + data.file.filename + '" name="' + formName + '_file" type="hidden">' +
					'<input value="' + data.file._id + '" name="' + formName + '_id" type="hidden">');
				// $('.uploadedFiles').append('<input value="' + data.file.filename + '" name="' + formName + '_name" type="hidden">' +
				// 	'<input value="' + data.file.originalname + '" name="' + formName + '_file" type="hidden">');
				// (allLoaded) ? self.registerRamal() : '';
				self.parseKML(data.file.filename);
			},
			error: function() {
				self.$loader.hide();
			}
		});
	},
	/**************************************************
	**        End list
	**************************************************/
	/**************************************************
	**        Start Parse KML
	**************************************************/
	parseKML: function (file) {
		var self = this;
		var fileKML = file;

		$.ajax('/uploads/' + fileKML).done(function(xml) {
			console.log(toGeoJSON.kml(xml));
			self.kml = toGeoJSON.kml(xml);
			$('.sortable.sections').empty();
			$.each(ramales.kml.features, function (i, item){
				if (item.geometry.type == 'Point') {
					if (item.properties.name.toLowerCase().match('seccion')) {
						self.appendSection(item.properties.name.split(':')[1], item.properties.name.split(':')[0]);
					} else {
						if (item.properties.name.toLowerCase().match('cabecera')) {
							$('#cabecera').val(item.properties.name.split(':')[1]);
						} else if (item.properties.name.toLowerCase().match('terminal')) {
							$('#terminal').val(item.properties.name.split(':')[1]);
						}
					}
				} else {
					if (item.properties.name.toLowerCase().match('ida')) {
						$('#recorrido_ida .ida').val(item.properties.name);
						$('#recorrido_ida .ida_km').val(item.properties.description);
					} else if (item.properties.name.toLowerCase().match('vuelta')) {
						$('#recorrido_vuelta .vuelta').val(item.properties.name);
						$('#recorrido_vuelta .vuelta_km').val(item.properties.description);
					}
				}
			});
			var map = new google.maps.Map(document.getElementById('map'), {
				zoom: 11,
				mapTypeId: 'roadmap',
				disableDefaultUI: true,
				zoomControl: true,
				scaleControl: false
			});

			var ctaLayer = new google.maps.KmlLayer({
				url: '/uploads/' + fileKML,
				// url: 'http://c1600286.ferozo.com/RamalA-Rocax60.kml',
				map: map
			});


			// map.data.addGeoJson(self.kml);
			// map.data.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/google.json');
			// var ctaLayer = new google.maps.KmlLayer({
			// 	url: 'http://c1600286.ferozo.com/RamalA-Rocax60.kml',
			// 	map: map
			// });
			self.updateSections();

			self.$loader.hide();
		});
	},
	/**************************************************
	**        End Parse KML
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

		// 	self.registerRamal();

		// });
	},
	/**************************************************
	**        End submit
	**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var ramales = new Ramal();
