var nua = navigator.userAgent;
var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

var Run = function () {

/**************************************************
** 						Begin Selectors
**************************************************/
	function init_SmartWizard() {
		"undefined" != typeof $.fn.smartWizard && (
		console.log("init_SmartWizard"),
		$("#wizard").smartWizard(),
		$("#wizard_verticle").smartWizard({transitionEffect:"slide"}),
		$(".buttonNext").addClass("btn btn-success"),
		$(".buttonPrevious").addClass("btn btn-primary"),
		$(".buttonFinish").addClass("btn btn-default")
	)}

	// Body
	this.$body = $('body');
	// Wrapper
	this.$wrapper = $('.wrapper');
		// Header
		this.$header = this.$wrapper.find('header');
			// Topbar
			this.$nav = this.$header.find('nav');
				// Page Title / Description
				this.$pageTitle = this.$nav.find('h1 .titleData');
				this.$pageDescription = this.$nav.find('h1 .descriptionData');
				// Right Menu
				this.$taskMenu = this.$nav.find('div ul.nav .tasks-menu');
				this.$notificationMenu = this.$nav.find('div ul.nav .notifications-menu');

		this.$addItem = this.$wrapper.find('.addItem');
		this.$username = this.$wrapper.find('.username');
		this.$userimg = this.$wrapper.find('.userimg');
		this.$logout = this.$wrapper.find('.log-out');
		this.$topbar = this.$wrapper.find('.main-header');
			this.$titleData = this.$topbar.find('.titleData');
			this.$descriptionData = this.$topbar.find('.descriptionData');
	// Login Page
	this.$loginButton = $('.loginButton');
	this.$login = $('#login');
		this.$emailInput = this.$login.find('.email');
		this.$passInput = this.$login.find('.password');
		this.$powerButton = this.$login.find('.submit');

	this.$content = $('#content');
	// Users Page
		this.$userFilter = this.$content.find('.userFilter');
			this.$userSortSelect = this.$userFilter.find('select');
			this.$userSortBy = this.$userFilter.find('.sortBy');
			this.$userSortOrder = this.$userFilter.find('.sortOrder');
			this.$userFilterString = this.$userFilter.find('.stringFilter')
		this.$userList = this.$content.find('.userlist');
	// Company Page
		this.$companyFilter = this.$content.find('.companyFilter');
			this.$companySortSelect = this.$companyFilter.find('select');
			this.$companySortBy = this.$companyFilter.find('.sortBy');
			this.$companySortOrder = this.$companyFilter.find('.sortOrder');
			this.$companyFilterString = this.$companyFilter.find('.stringFilter')
		this.$companyList = this.$content.find('.companylist');
	// Tables Page
		this.$tablesFilter = this.$content.find('.tablesFilter');
			this.$tablesSortSelect = this.$tablesFilter.find('select');
			this.$tablesSortBy = this.$tablesFilter.find('.sortBy');
			this.$tablesSortOrder = this.$tablesFilter.find('.sortOrder');
			this.$tablesFilterString = this.$tablesFilter.find('.stringFilter')
		this.$tablesList = this.$content.find('.tableslist');

	/**************************************************
	** 							End Variables
	**************************************************/

	//  Page
	this.mode;
	this.dataTitle = this.$body.data('title') || '';
	this.dataDescription = this.$body.data('description') || '';
	this.controller = this.$body.data('page') || '';
	this.mode = this.$body.data('mode') || '';

	this.promises = [];

	//  User
	this.email;
	this.password;

	this.user;
	this.users;
	this.userFilterString;
	this.userFilterFlag = false;

	this.companies;
	this.companies_id = [];
	this.companyFilterString;
	this.companyFilterFlag = false;

	//  Login Token
	this.clientSecret = "aA)v/5LApZ6HK4)4w";
	this.watcha_token;
	this.access_token;
	this.refresh_token;
	this.powerAction;

	this.overlay = $('#overlay');

	this.init();
};

Run.prototype = {
	init: function () {
		var self = this;

		self.setData();
		self.getCompany();
		self.bindEvents();
	},
/**************************************************
**						Bind Events
**************************************************/
	bindEvents: function() {
		var self = this;

		self.$logout.on('click', function(){
				main.removeToken();
				window.location.href = "/";
		});
		$(document).on('click', '.btn-delete', function(){
			var element = $('#myModal');
			var header = element.find('.modal-title');
			var body = element.find('.modal-body');
			var footer = element.find('.modal-footer');

			header.empty();
			body.empty();
			footer.empty();

			header
				.append($('<h3 />', { 'class': 'profile-username text-center capitalize', text: 'Eliminar' }));
			body
				.append($('<div />', { 'class': 'box-body' })
					.append($('<p />', { 'class': 'text-muted', text: '¿Esta seguro de querer eliminar el elemento?' }))
				);
			footer
				.append($('<button />', { 'class': 'btn pull-left form-control btn-small', 'data-dismiss': 'modal', text: 'Cerrar' }))
				.append($('<button />', { 'class': 'btn form-control btn-small bg-red confirmDelete', 'data-dismiss': 'modal', text: 'Eliminar', 'data-collection': $(this).data('collection'), 'data-collectionid': $(this).data('id') }));
		});
		$(document).on('click', '.confirmDelete', function() {
			main.confirmDelete($(this).data('collection'), $(this).data('collectionid'));
		});
		$(document).on('click', '.dropdown-menu .openModal', function() {
			notification.fillModal($('#myModal'), $(this).data('id'));
		});
		// main.clearLocalStorage();
	},
/**************************************************
**						End Bind Events
**************************************************/
/**************************************************
**						Set Data
**************************************************/
	setData: function() {
		var self = this;

		self.$pageTitle.text(self.dataTitle);
		self.$pageDescription.text(self.dataDescription);
	},
/**************************************************
**						End Set Data
**************************************************/
/**************************************************
**						Get Company
**************************************************/
	getCompany: function() {
		var self = this;

		main.getConfig();

		// self.promises.push(
			// $.ajax({
				// url: company.getRelated(),
				// success:function(){
				// }
			// })
		// );
		// $.when.apply($, self.promises).then(function() {
		// code here when all ajax calls are done
		// you could also process all the results here if you want
		// rather than processing them individually
			// socketio.bindEvents();
			// socketio.keyboardEvent();
			// socketio.setUsername();

			// (main.functionsObj.hasOwnProperty(self.controller)) ? main.functionsObj[self.controller].initController(self.mode) : '';

		// });

	}
/**************************************************
**						End Get Company
**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var run = new Run();


