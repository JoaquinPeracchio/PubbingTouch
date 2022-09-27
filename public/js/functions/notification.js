	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	var Notif = function () {

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
			this.$notificationtart = this.$rangestart.find('#notificationtart');
		this.$rangeend = this.$form.find('#rangeend');
			this.$notificationend = this.$rangeend.find('#notificationend');

		this.$inputSector = this.$form.find('#parent');
		this.$parent = this.$form.find('.parent');
		this.$tableStatus = this.$form.find('.tableStatus');

		this.$draggableArea = this.$form.find('#draggableArea');
			this.$tableItem = $(document).find('.tableItem');
			this.$available = $(document).find('.tableItem.available');

		this.$reservedTable = this.$form.find('#reserved_table');

		this.$reservedBy = this.$form.find('#reserved_by');

	this.$content = $('#content');
	// Notification Page
		this.$notificationFilter = this.$content.find('.notificationFilter');
			this.$notificationSortSelect = this.$notificationFilter.find('select');
			this.$notificationSortBy = this.$notificationFilter.find('.sortBy');
			this.$notificationSortOrder = this.$notificationFilter.find('.sortOrder');
			this.$notificationFilterString = this.$notificationFilter.find('.stringFilter')
		this.$notificationList = this.$content.find('.notificationlist');

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.mode = this.$body.data('mode');

	this.access_token = window.localStorage.getItem('access_token');

	this.controller = 'notification';

	this.notification;
	this.notificationTopbar = [];

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

Notif.prototype = {
	init: function () {
		var self = this;

		self.submit();
	},
	/**************************************************
	**        End get Notifications
	**************************************************/
	/**************************************************
	**        Begin get notification
	**************************************************/
	getRelated: function (companyID, element, filterBy, state) {
		var self = this;
		var selector = element;
		var compid = companyID;
		var ajaxResult;

		$.ajax({
			url: "/notification/related",
			type:"POST",
			async: false,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: {
				parent: companyID,
				filter: filterBy,
				status: state
			}
		}).done(function( data ) {
			ajaxResult = data.collection;
			self.collection = data.collection;
		}).fail(function(data) {
			ajaxResult = data;
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
		});
	},
	/**************************************************
	**        End get Notifications
	**************************************************/
	/**************************************************
	**        Begin get notification
	**************************************************/
	get: function (companyID, element, filterBy, state) {
		var self = this;
		var selector = element;
		var compid = companyID;
		var ajaxResult;

		$.ajax({
			url: "/notification/related",
			type:"POST",
			async: false,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
			data: {
				parent: companyID,
				filter: filterBy,
				status: state
			}
		}).done(function( data ) {
			ajaxResult = data.collection;
			self.collection = data.collection;
		}).fail(function(data) {
			ajaxResult = data;
			main.removeToken();
			main.initLogin();
			self.$loader.hide();
		});

		return ajaxResult;
	},
	/**************************************************
	**        End get Notifications
	**************************************************/
	/**************************************************
	**        Begin Generate Tabs
	**************************************************/
	generateTabs: function (element, companyID) {
		var self = this;

		element.prepend(
		$('<div />', { 'class': 'box-body align-center' })
			.append($('<a />', { 'class': 'btn btn-app capitalize form-control', 'href': '/notification/register', text: 'Agregar Cumplimiento' }))
		)
	},
	/**************************************************
	**        End Generate Tabs
	**************************************************/
	/**************************************************
	**        Begin Generate Notification
	**************************************************/
	generate: function (element, companyID, item) {
		var self = this;

		if (!element) {
			var element = element.closest('ul').siblings('.tab-content').find('#cumplimientos-' + companyID);
		}

		// $.each(data, function (i, item) {
			(item.status == 'aprobado') ? color = 'green' : (item.status == 'rechazado') ? color = 'red' : (item.status == 'presentado') ? color = 'blue' : color = 'grey';
			(item.category == 'cumplimiento') ? catColor = 'blue' : catColor = 'orange';
			// Begin Dropdown Title
			element.append($('<div />', { 'class': 'panel box border-color box-profile title notificationid_' + item._id })
				.append($('<div />', { 'class': 'box-tools pull-right' })
					.append($('<span />', { 'class': 'capitalize label bg-gray', text: company.collection[main.getIndex(company.collection, item.parent)].titlename }))
					.append($('<span />', { 'class': 'capitalize label bg-' + catColor, text: item.category }))
					.append($('<a />', { 'href': '/notification/edit/' + item._id, 'class': 'btn btn-box-tool' })
						.append($('<i />', { 'class': 'fa fa-pencil'}))
					)
					.append($('<a />', { 'class': 'btn btn-box-tool deleteParque', 'data-collection': 'notification', 'data-notificationid': item.parent })
						.append($('<i />', { 'class': 'fa fa-remove'}))
					)
				)
				.append($('<a />', { 'class': 'accordion collapsed', 'data-toggle': 'collapse', 'data-parent': '#accordion', 'aria-expanded': false, 'href': '#notificationid_' + item._id })
					.append($('<a />', { 'class': 'ui ' + color + ' ribbon label capitalize', text: item.status }))
					.append($('<h3 />', { 'class': 'profile-username text-center capitalize', text: item.titlename }))
				)
				.append($('<div />', { 'class': 'panel-collapse collapse', 'id': 'notificationid_' + item._id, 'aria-expanded': false })
					.append($('<div />', { 'class': 'box-body' })
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
					)
				)
			)
		// });

	},
	/**************************************************
	**        End Generate Notifications
	**************************************************/
	/**************************************************
	**        Begin Append Notification Topbar
	**************************************************/
	appendNotificationTopbar: function (element, data) {
		var self = this;
		var notificationsLength = element.find('a .notifications-length');

		notificationsLength.text(parseInt(notificationsLength.text()) + data.length);

		$.each(data, function (i, item) {
			self.notificationTopbar.push(item);
			(item.status == 'aprobado') ? color = 'green' : (item.status == 'rechazado') ? color = 'red' : (item.status == 'presentado') ? color = 'blue' : color = 'grey';
			(item.category == 'cumplimiento') ? catColor = 'blue' : catColor = 'orange';
			// Begin Dropdown Title
			element.find('ul li ul.menu').prepend($('<li />')
				.append($('<a />', { 'class': 'openModal', 'data-toggle':'modal', 'data-target':'#myModal', 'data-id': item._id, text: item.titlename })
					// .append($('<small />', { 'class': 'capitalize pull-left', text: company.collection[main.getIndex(company.collection, item.parent)].titlename }))
					.prepend($('<i />', { 'class': 'fa fa-exclamation text-orange'}))
				)
			)
		});
	},
	/**************************************************
	**        End Append Notification Topbar
	**************************************************/
	/**************************************************
	**        Begin Append Notification Topbar
	**************************************************/
	appendTaskTopbar: function (element, data) {
		var self = this;
		var tasksLength = element.find('a .tasks-length');

		tasksLength.text(parseInt(tasksLength.text()) + data.length);

		$.each(data, function (i, item) {
			self.notificationTopbar.push(item);
			(item.status == 'aprobado') ? color = 'green' : (item.status == 'rechazado') ? color = 'red' : (item.status == 'presentado') ? color = 'blue' : color = 'grey';
			(item.category == 'cumplimiento') ? catColor = 'blue' : catColor = 'orange';
			// Begin Dropdown Title
			element.find('ul li ul.menu').prepend($('<li />')
				.append($('<a />', { 'class': 'openModal', 'data-toggle':'modal', 'data-target':'#myModal', 'data-id': item._id })
					.append($('<h3 />', { text: item.titlename })
						// .append($('<small />', { 'class': 'capitalize pull-left', text: company.collection[main.getIndex(company.collection, item.parent)].titlename }))
						.append($('<small />', { 'class': 'pull-right', text: item.percent + '%' }))
					)
					.append($('<div />', { 'class': 'progress xs' })
						.append($('<div />', { 'class': 'progress-bar progress-bar-aqua', 'style': 'width: ' + item.percent + '%', 'role': 'progressbar', 'aria-valuenow': item.percent, 'aria-valuemin': 0, 'aria-valuemax': 100 })
							.append($('<span />', { 'class': 'sr-only', text: item.percent + '%' }))
						)
					)
				)
			)
		});
	},
	/**************************************************
	**        End Append Notification Topbar
	**************************************************/
	/**************************************************
	**        Begin Fill Modal
	**************************************************/
	fillModal: function (element, id) {
		var self = this;
		var header = element.find('.modal-title');
		var body = element.find('.modal-body');
		var footer = element.find('.modal-footer');

								     // company.collection[main.getIndex(company.collection, item.parent)].titlename
		var item = self.notificationTopbar[main.getIndex(self.notificationTopbar, id)];

		header.empty();
		body.empty();
		footer.empty();

		header.append($('<a />', { 'href': '#notificationid_' + item._id })
			.append($('<a />', { 'class': 'ui orange ribbon label capitalize', text: item.status }))
			.append($('<h3 />', { 'class': 'profile-username text-center capitalize', text: item.titlename }))
		);
		body.append($('<div />', { 'id': 'notificationid_' + item._id })
			.append($('<div />', { 'class': 'box-body' })
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
				.append($('<p />', { 'class': 'text-muted', text: item.comment }))
			)
		);
		footer.append($('<div />', { 'class': 'company badge pull-left', text: company.collection[main.getIndex(company.collection, item.parent)].titlename }))
		.append(
			(typeof item.expiration !== 'undefined') ?
			$('<div />', { 'class': 'expiration badge bg-red', text: item.expiration })
				.prepend($('<span />', { text: 'Vencimiento: ' }))
				.prepend($('<i />', { 'class': 'fa fa-calendar-times-o' }))
			: ''
		);
	},
	/**************************************************
	**        End Append Notification Topbar
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

		// 	self.registerNotification();

		// });
	}
	/**************************************************
	**        End submit
	**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var notification = new Notif();
