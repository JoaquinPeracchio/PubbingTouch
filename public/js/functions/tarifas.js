	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Tarifa = function () {

	/**************************************************
					Begin Selectors
	**************************************************/


	// Body
	this.$body = $('body');
	// Loader
	this.$loader = $('#loader');

	this.$form = $(document).find('form');

		this.$expiration = this.$form.find('.expiration');
		this.$selectedTarifa = this.$form.find('.selectedTarifa');
		this.$addTarifa = this.$form.find('.addTarifa');

		this.$rangestart = this.$form.find('#rangestart');
			this.$tarifastart = this.$rangestart.find('#tarifastart');
		this.$rangeend = this.$form.find('#rangeend');
			this.$tarifasend = this.$rangeend.find('#tarifasend');

		this.$inputSector = this.$form.find('#parent');
		this.$parent = this.$form.find('.parent');
		this.$tableStatus = this.$form.find('.tableStatus');

		this.$draggableArea = this.$form.find('#draggableArea');
			this.$tableItem = $(document).find('.tableItem');
			this.$available = $(document).find('.tableItem.available');

		this.$reservedTable = this.$form.find('#reserved_table');

		this.$reservedBy = this.$form.find('#reserved_by');

	this.$content = $('#content');
	// Tarifa Page
		this.$tarifasFilter = this.$content.find('.tarifasFilter');
			this.$tarifasSortSelect = this.$tarifasFilter.find('select');
			this.$tarifasSortBy = this.$tarifasFilter.find('.sortBy');
			this.$tarifasSortOrder = this.$tarifasFilter.find('.sortOrder');
			this.$tarifasFilterString = this.$tarifasFilter.find('.stringFilter')
		this.$tarifasList = this.$content.find('.tarifaslist');

	this.$ramalForm = $('#ramalForm');
		this.$uploadKmlFile = this.$ramalForm.find('.upload-kml');

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.mode = this.$body.data('mode');

	this.access_token = window.localStorage.getItem('access_token');

	this.controller = 'tarifas';

	this.users = [];
	this.tables;
	this.tarifas;
	this.bokings;
	this.configuration;

	this.dates = [];
	this.serializeArr;

	this.tarifaInput;

	this.today = new Date();
	this.tomorrow = new Date();
		this.tomorrow.setDate(this.today.getDate()+1);

	this.startTime = new Date(this.today).toISOString();
	this.endTime = new Date(this.tomorrow).toISOString();

	this.kml;

	this.init();
};

Tarifa.prototype = {
	init: function () {
		var self = this;

		// self.getConfig();
		// self.getTarifas();
		// 	self.dateRange();
		// self.bindEvents();
		// (self.mode == 'list') ? self.list() : '';
		// self.submit();
	},
	/**************************************************
	**        Start getConfig
	**************************************************/
	getConfig: function (value) {
		var self = this;

		$.ajax({
			url: "/config/list",
			type:"GET",
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
		}).done(function( data ) {
			console.log(data.configuration);
		// users = JSON.stringify(data);
		self.configuration = data.configuration;

		}).fail(function() {
			console.log('fail get config');
		});

	// $('.sortable').sortable({
	// 	update: function( ) {
	// 		if($(this).hasClass('sections')) {
	// 			$.each($('.item', this), function (i, item) {
	// 				$('.section_label', this).text('Seccion ' + ($(this).index() + 1));
	// 				$('.section_order', this).val('Seccion ' + ($(this).index() + 1));
	// 			});
	// 		}
	// 	}
	// });
	// 	$('.sortable').disableSelection();

	// function initMap() {
	//   var map = new google.maps.Map(document.getElementById('map'), {
	//     zoom: 11,
	//   });

	//   var ctaLayer = new google.maps.KmlLayer({
	//     url: '/kml/TarifaA-Rocax60.kml',
	//     map: map
	//   });
	// }


	},
	/**************************************************
	**        End getConfig
	**************************************************/
	/**************************************************
	**        Begin get lineas
	**************************************************/
	getLineas: function (company, index) {
		var self = this;

		$.ajax({
			url: "/lineas/related",
			type:"POST",
			async: false,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: {
				parent: company
			}
		}).done(function( data ) {
			console.log(data);
			self.lineas = data.lineas;
			self.companies[index] = Object.assign({'lineas': self.lineas}, self.companies[index])
			$('.ui.dropdown.noaddition').dropdown({
				transition: 'drop',
				onChange: function(value, text) {
					$(this).find('input.menu .selected').attr('data-image');
				}
			});
			$('.ui.dropdown.addition').dropdown({
				allowAdditions: true,
				forceSelection: false,
				hideAdditions: false, // this line
			onChange: function(value, text) {
				$(this).find('input.menu .selected').attr('data-image');
			},
				transition: 'drop'
			});
			$.each(self.lineas, function (i, item) {
				$('.parent_linea').append('<div class="item" data-company="' + self.companies[index]._id + '" data-value="' + item._id +'"">' + item.number + ' (' + self.companies[index].titlename + ')</div>');
			});

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
	**        Begin get Tarifas
	**************************************************/
	getTarifas: function (company, index) {
		var self = this;

		$.ajax({
			url: "/tarifas/listtarifas",
			type:"GET",
			async: false,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: {
				// parent: company
			}
		}).done(function( data ) {
			console.log(data);
			self.tarifas = data.collection;
			// $('.ui.dropdown.tarifaInput').dropdown({
			// 	allowAdditions: true,
			// 	forceSelection: false,
			// 	hideAdditions: false, // this line
			// onChange: function(value, text) {
			// 	var isNew = false;
			// 	self.tarifaInput = $('.tarifaInput .text').text();

			// 	$.each(self.tarifas, function (i, item) {
			// 		if (self.tarifaInput == item.titlename) {
			// 			isNew = true;
			// 			return false;
			// 		} else {
			// 			isNew = false;
			// 		}
			// 	});
			// 	if (isNew == false) {
			// 		self.$selectedTarifa.attr('disabled');
			// 		self.registerTarifa(self.tarifaInput);
			// 		// self.$addTarifa.removeClass('disabled').one('click', function(){
			// 		// 	self.$addTarifa.addClass('disabled');
			// 		// });
			// 	} else {
			// 		self.$selectedTarifa.removeAttr('disabled');
			// 	}

			// 	$(this).find('input.menu .selected').attr('data-image');
			// },
			// 	transition: 'drop'
			// });
			// $.each(self.tarifas, function (i, item) {
			// 	$('.titlename').append('<div class="item" data-company="' + item.titlename + '" data-value="' + item._id +'"">' + item.titlename + '</div>');
			// });

		}).fail(function() {
			self.removeToken();
			self.initLogin();
			self.$loader.hide();
		});
	},
	/**************************************************
	**        End get Tarifas
	**************************************************/
	/**************************************************
	**        Start Register Tarifa
	**************************************************/
	registerTarifa: function (newTarifa, callback) {
		var self = this;
		var result;

		$.ajax({
			url: "/tarifas/tarifa",
			type:"POST",
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: {
				titlename: newTarifa
			},
			success:function(data){
				console.log('success');
				console.log(data);
				$('#tarifa_id').val(data._id);
				self.$selectedTarifa.removeAttr('disabled');
				result = data;
				(typeof callback !== 'undefined') ? callback(result) : '';
				//whatever you wanna do after the form is successfully submitted
			}
		});
		// (typeof callback !== 'undefined') ? callback(result) : '';
	},
	/**************************************************
	**        End Register Tarifa
	**************************************************/
	/**************************************************
	**        Start bind Events
	**************************************************/
	bindEvents: function (value) {
		var self = this;

		self.$uploadKmlFile.on('click', function (){
			self.uploadKml($('.kml_file'), 'kml');
		});

		$(document).on( "click", '.delete.icon', function() {
			$(this).parent().remove();  // jQuery 1.7+
		});

		self.$tarifasFilterString.on('input', function() {
			self.tarifasFilterString = self.$tarifasFilterString.val().replace(/\+/g, '');
			if (self.$tarifasFilterString.length && self.$tarifasFilterString.val().length) {
				self.tarifasFilterFlag = true;
			} else {
				self.tarifasFilterFlag = false;
			}
			self.populateTarifas();
		});

		$.each(self.$expiration, function(i, item){
			$(this).calendar({
				type: 'date',
				ampm: false,
				today: true,
				onChange: function(date) {
					var year = date.getFullYear();
					var month = date.getMonth();
			        var day = date.getDate();

					var unparsedTime = new Date(year, month, day);
					self.expTime = new Date(unparsedTime).toISOString();
					console.log(self.expTime);
				}
			});
		});
	},
	/**************************************************
	**        End Bind Events
	**************************************************/
	/**************************************************
	**        Start list
	**************************************************/
	list: function (value) {
		var self = this;

		self.tarifasFunctions();
	},
	/**************************************************
	**              tarifas Functions
	**************************************************/
	tarifasFunctions: function (isAdmin) {
		var self = this;

		self.tarifasList();
	},
	/**************************************************
	**              End tarifas Functions
	**************************************************/
	/**************************************************
	**              tarifas List
	**************************************************/
	tarifasList: function () {
		var self = this;

		self.$loader.show();
		self.$tarifasList.empty();

		$.ajax({
			// url: "/tarifas/tarifasinfo",
			url: "/" + self.controller + "/related",
			type:"GET",
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
		}).done(function( data ) {
			console.log(data);
			self.tarifas = data.tarifas;
			if (self.tarifas.length != 0) {
				main.sortProperties(data.tarifas, self.$tarifasSortBy.val(), self.$tarifasSortOrder.val());
				self.populateTarifas();
			}
		}).fail(function() {
			self.removeToken();
			self.initLogin();
			self.$loader.hide();
		});
	},
	/**************************************************
	**              End tarifas List
	**************************************************/
	/**************************************************
	**              Populate Tarifas
	**************************************************/
	populateTarifas: function (stringFilter) {
		var self = this;

		self.$tarifasList.empty();
		if (self.tarifasFilterFlag) {
			$.each(self.tarifas, function (i, item) {
				if (String(item[self.$tarifasSortBy.val()]).toLowerCase().match(self.tarifasFilterString.toLowerCase())) {
					self.generateTarifas(i ,item);
				}
			});
		} else {
			$.each(self.tarifas, function (i, item) {
				self.generateTarifas(i, item);
			});
		}
		$('.menu .item').tab();
	},
	/**************************************************
	**              End Populate Tarifas
	**************************************************/
	/**************************************************
	**              Bind Events
	**************************************************/
	generateTarifas: function (i, item) {
		var self = this;
	},
	/**************************************************
	**        End list
	**************************************************/
	/**************************************************
	**        Start dateRange
	**************************************************/
	dateRange: function (value) {
		var self = this;

		// var today = new Date();
		// self.$rangestart.calendar({
		// 	type: 'month',
		// 	ampm: false,
		// 	today: true,
		// 	endCalendar: self.$rangeend,
		// 	onChange: function(date) {
		// 		var year = date.getFullYear();
		// 		var month = date.getMonth();

		// 		var unparsedTime = new Date(year, month);
		// 		self.startTime = new Date(unparsedTime).toISOString();
		// 		console.log(self.startTime);
		// 	}
		// });
		// // self.filterByRangeDate();
		// self.$rangeend.calendar({
		// 	type: 'month',
		// 	ampm: false,
		// 	// dayEnd: true,
		// 	startCalendar: self.$rangestart,
		// 	onChange: function(date) {
		// 		if (typeof date !== 'undefined') {
		// 			var year = date.getFullYear();
		// 			var month = date.getMonth();

		// 			var unparsedTime = new Date(year, month);
		// 			self.endTime = new Date(unparsedTime).toISOString();
		// 			console.log(self.endTime);
		// 			self.getMonths(self.startTime, self.endTime);
		// 			$('.sortable.tarifas').empty();
		// 			self.appendTarifa('Direccion', 'Seccion');
		// 			$(':focus').blur()

		// 			// var startTime = new Date($('#bookingstart').val()).toISOString();
		// 			// var endTime = new Date($('#bookingend').val()).toISOString();
		// 			// self.filterByRangeDate();
		// 		} else {
		// 			self.$rangeend.val('');
		// 		}
		// 	}
		// });
	},
	/**************************************************
	**        End dateRange
	**************************************************/
	/**************************************************
	**        Start submit
	**************************************************/
	getMonths: function (startDate, endDate) {
		var self = this;

		var start      = startDate.split('-');
		var end        = endDate.split('-');
		var startYear  = parseInt(start[0]);
		var endYear    = parseInt(end[0]);

		self.dates = [];
		for(var i = startYear; i <= endYear; i++) {
			var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
			var startMon = i === startYear ? parseInt(start[1])-1 : 0;
			for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
				var month;
				switch(j) {
					case 0:
						var month = 'Enero';
						break;
					case 1:
						var month = 'Febrero';
						break;
					case 2:
						var month = 'Marzo';
						break;
					case 3:
						var month = 'Abril';
						break;
					case 4:
						var month = 'Mayo';
						break;
					case 5:
						var month = 'Junio';
						break;
					case 6:
						var month = 'Julio';
						break;
					case 7:
						var month = 'Agosto';
						break;
					case 8:
						var month = 'Septiembre';
						break;
					case 9:
						var month = 'Octubre';
						break;
					case 10:
						var month = 'Noviembre';
						break;
					case 11:
						var month = 'Diciembre';
						break;
					default:
						console.log('default');
						break;
				}
				var displayMonth = month < 10 ? '0'+month : month;
				self.dates.push({month: displayMonth, year: i, date: Date.parse(i + '-' + (j+1))});
			}
		}
		console.log(self.dates);
	},
	/**************************************************
	**        End dateRange
	**************************************************/
	/**************************************************
	**        Start submit
	**************************************************/
	appendTarifa: function (title, section) {
		var self = this;

		$.each(main.configuration[0].tarifas, function(i, item){
			$('.sortable.tarifas').append(
			$('<div />', { 'class': 'card-pf box border-color item', 'data-name': item.name, 'data-concepto': item.concepto, 'data-tipo': item.tipo, 'data-value': item.name })
				.append($('<div />', { 'class': 'box-header text-center' })
					.append($('<button />', { 'class': 'btn btn-box-tool btnDelete pull-right delete section' })
						.prepend($('<i />', { 'class': 'fa fa-remove' }))
					)
					.append($('<p />', { 'class': 'no-margin capitalize sections_label', text: item.name }))
				)
				.append($('<div />', { 'class': 'box-body btn no-margin fc-grid text-center capitalize' })
					// Begin Table
					// Begin Table
					.append($('<table />', { 'class': 'table table-hover' })
						.append($('<thead />', {})
							.append($('<tr />', {})
								.append($('<th />', { text: item.concepto }))
								// .append($('<th />', { text: 'Tarifa actual' })
								// 	.append($('<br />'))
								// 	.append($('<span />', { text: '(AR$/Boleto)' }))
								// )
								// Begin Arrayhttps://www.facebook.com/#
								.append(
									$.map(self.dates, function(value, i) {
										// Begin Dropdown Title
										return $('<th />', { text: value.month + ' ' + value.year })
											.append($('<br />'))
											.append($('<span />', { text: '(AR$/Boleto)' }))
											.append(
												$('<input />', {
													'class': 'date_input',
													'type': 'hidden',
													'value': value.date
												})
											)
									})
								)
							)
						)
						.append($('<tbody />', {})
						)
					) // End Table
				) // End Table
				.append($('<div />', { 'class': 'box-footer btn no-margin fc-grid text-center capitalize' })
					.append($('<div />', { 'class': 'col-xs-6 col-sm-6 col-md-6 col-lg-6' })
						.append($('<label />', { 'class': 'form-control-label' }))
						.append($('<div />', { 'class': 'input-group' })
							.append($('<span />', { 'class': 'form-control addValue' })
								.append($('<i />', { 'class': 'fa fa-plus' }))
							)
						)
					)
				)
			)
		});

		$(document).find('.addValue').on('click', function(){
			var tipoTarifa = $(this).closest('.item').data('value');
			$(this).closest('.item').find('tbody')
				.append($('<tr />', {})
					.append($('<td />')
						.append(
							$('<div />', { 'class': 'ui input left icon' })
							.prepend(
								$('<i />', { 'class': 'fa fa-arrows-h' }))
							.append(
								$('<input />', {
									'class': 'concepto form-control',
									'placeholder': $(this).closest('.item').data('concepto'),
									'type': $(this).closest('.item').data('tipo'),
									'step': '0.01',
									// 'name': $(this).closest('.item').data('value') + '_concepto'
								})
							)
						)
					)
					// .append($('<td />')
					// 	.append(
					// 		$('<div />', { 'class': 'ui input left icon' })
					// 		.prepend(
					// 			$('<i />', { 'class': 'dollar sign icon' }))
					// 		.append(
					// 			$('<input />', { 'class': 'current_date', 'placeholder': 'Valor', 'type': 'number', 'step': '0.05' })
					// 		)
					// 	)
					// )
					// Begin Array
					.append(
						$.map(self.dates, function(value, i) {
							// Begin Dropdown Title
							return $('<td />')
								.append(
									$('<div />', { 'class': 'ui input left icon' })
									.prepend(
										$('<i />', { 'class': 'fa fa-dollar' }))
									.append(
										$('<input />', {
											'class': 'form-control date_' + value.date,
											'data-date': value.date,
											'data-month': value.month.toLowerCase(),
											'data-year': value.year,
											'data-tarifa': tipoTarifa,
											'placeholder': 'Valor',
											'type': 'number',
											'step': '0.05',
											// 'name': 'sections_name'
										})
									)
								)
						})
					)
				)
		});

		$.each($('.sortable.sections .item'), function (i, item) {
			$('.section_label', this).text('Seccion ' + ($(this).index() + 1));
			$('.section_order', this).val(($(this).index() + 1));
		});

	},
	/**************************************************
	**        End list
	**************************************************/
	/**************************************************
	**        Start submit
	**************************************************/
	uploadFile: function (selector, formName, allLoaded) {
		var self = this;

			self.$loader.show();
			var dataForm = new FormData();
			var hasFile = false;
			$.each(selector[0].files, function(i, file) {
				hasFile = true;
				dataForm.append('myFile', file);
			});

			if(hasFile) {
				$.ajax({
					url: '/upload/uploadfile',
					data: dataForm,
					async: false,
					cache: false,
					contentType: false,
					processData: false,
					method: 'POST',
					type: 'POST', // For jQuery < 1.9
					success: function(data){
						console.log(data);
						$('.uploadedFiles').append('<input value="' + data.file.filename + '" name="' + formName + '_name" type="hidden">' +
							'<input value="' + data.file.originalname + '" name="' + formName + '_file" type="hidden">');
						// (allLoaded) ? self.registerLinea() : '';
					}
				});
			}
			self.$loader.hide();

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

		// 	var tarifaObj = [];
		// 	var concept;
		// 	$.each($('.item tbody tr'), function(){
		// 			$.each($('td input', this), function(){
		// 			if ($(this).hasClass('concepto')) {
		// 				concept = $(this).val();
		// 				} else {
		// 					tarifaObj[$(this).data('date')] = tarifaObj[$(this).data('date')] || {};
		// 					tarifaObj[$(this).data('date')][$(this).data('tarifa')] = tarifaObj[$(this).data('date')][$(this).data('tarifa')] || [];
		// 					tarifaObj[$(this).data('date')][$(this).data('tarifa')].push({concept: concept, price: $(this).val()});
		// 				}
		// 			});
		// 	});

		// 	$('.sortable.sections .item').length;
		// 	var sections = [];
		// 	$.each($('.sortable.sections .item'), function (i, item) {
		// 		console.log(item.value);
		// 		console.log(i);
		// 		sections.push({
		// 			name : $(this).find('.section_name').val(),
		// 			order : $(this).find('.section_order').val()
		// 		})
		// 	});

		// 	self.uploadFile($('.permiso_file'), 'permiso');
		// 	self.uploadFile($('.resolucion_file'), 'resolucion');

		// 	$.each(Object.keys(tarifaObj), function(i, item) {
		// 		console.log(tarifaObj[item]);
		// 		self.registerCuadroTarifario(tarifaObj[item], item.replace('date_', ''));
		// 	});

		// });
	},
	/**************************************************
	**        End submit
	**************************************************/
	/**************************************************
	**        Start Register Tarifa
	**************************************************/
	registerCuadroTarifario: function (tarifa, date) {
		var self = this;

		self.$loader.show();
		self.serializeArr = $('form').serializeArray();
		// var stringTarifa = JSON.stringify(tarifaObj);

		$.each(Object.keys(tarifa), function(i, item) {
			console.log(tarifa[item]);
			self.serializeArr.push({ name: 'titlename', value: self.tarifaInput});
			self.serializeArr.push({ name: 'tarifa_type', value: item});
			self.serializeArr.push({ name: 'date', value: date});
			$.each(Object.keys(tarifa[item]), function(i, el){
				var stringTarifa = JSON.stringify(tarifa[item][el]);
				// self.serializeArr.push({ name: 'stringtarifa', value: stringTarifa});
				self.serializeArr.push({ name: 'concept', value: tarifa[item][el].concept});
				self.serializeArr.push({ name: 'price', value: tarifa[item][el].price});
				// $.each(Object.keys(tarifa[item][el]), function(i, element){
				// 		console.log(tarifa[item][el][element].concept);
				// 		console.log(tarifa[item][el][element].price);
				// });
			});
		});

console.log(self.serializeArr);
		$.ajax({
			url: "/tarifas/register",
			type:"POST",
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: self.serializeArr,
			success:function(data){
				self.$loader.hide();
				console.log('success');
				console.log(data);
				self.$selectedTarifa.removeAttr('disabled');
				window.location.href = '/company';
				//whatever you wanna do after the form is successfully submitted
			}
		});
		self.$loader.hide();
	}
	/**************************************************
	**        End Register Tarifa
	**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var tarifas = new Tarifa();
