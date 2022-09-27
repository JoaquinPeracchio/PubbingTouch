		var nua = navigator.userAgent;
		var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

		var Auth = function () {

		/**************************************************
										Begin Selectors
		**************************************************/
		// Body
		this.$body = $('body');
		// Loader
		this.$loader = $('#loader');
		// Sidebar
		this.$sidebar = $('.sidebar');
				this.$sidebarBtn = this.$sidebar.find('.sidebarBtn');
		// topbar
		this.$wrapper = $('.wrapper');
				this.$addItem = this.$wrapper.find('.addItem');
				this.$username = this.$wrapper.find('.username');
				this.$userimg = this.$wrapper.find('.userimg');
				this.$logout = this.$wrapper.find('.log-out');
			this.$topbar = this.$wrapper.find('.auth-header');
				this.$titleData = this.$topbar.find('.titleData');
				this.$descriptionData = this.$topbar.find('.descriptionData');
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
										End Variables
		**************************************************/

		//  Config
		this.configuration;

		//  Page
		this.mode;
		this.titleData;
		this.descriptionData;

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

	// Collection Array
	this.functionsObj = {};


	// Local Storage
	this.companyLS = window.localStorage.getItem('company') || '';
	this.lineaLS = window.localStorage.getItem('linea') || '';
	this.ramalLS = window.localStorage.getItem('ramal') || '';
	this.horarioLS = window.localStorage.getItem('horario') || '';
	this.parqueLS = window.localStorage.getItem('parque') || '';
	this.tarifaLS = window.localStorage.getItem('tarifa') || '';
	this.notificationLS = window.localStorage.getItem('notification') || '';

	this.fileArr = [];

		this.init();
};

	Auth.prototype = {
		init: function () {
			var self = this;

			self.titleData = self.$body.data('title') || '';
			self.descriptionData = self.$body.data('description') || '';
			if (window.localStorage.getItem('access_token')) {
				self.isAuthorized();
			} else {
				// self.$loginButton.on('click', function(){
				// 	self.$login.addClass('active');
				// });
				(window.location.pathname != '/') ? window.location.href = "/" : '';
				self.initLogin();
			}
		},
		/**************************************************
		**					Auth
		**************************************************/
		isAuthorized: function() {
			var self = this;

			self.access_token = window.localStorage.getItem('access_token');
			self.refresh_token = window.localStorage.getItem('refresh_token');

			$.ajax({
				url: "/users/userinfo",
				type:"GET",
				async: false,
				headers: { 
					"Authorization": self.access_token
				},
				dataType:"json",
			}).done(function( data ) {
				self.user = data;
				self.userData(data);
				// self.startApp(data);
			}).fail(function() {
				self.removeToken();
				window.location.href = "/";
			});

		},
		/**************************************************
		**				End Auth
		**************************************************/
		/**************************************************
		**				Login Form
		**************************************************/
		initLogin: function() {
			var self = this;

			self.$login.addClass('active');

			self.$powerButton.on('click', function () {
				self.email = self.$emailInput.val();
				self.password = self.$passInput.val();
				self.login();
			});
		},
		/**************************************************
		**              End Login Form
		**************************************************/
		/**************************************************
		**              Facebook Login
		**************************************************/
		login: function () {
			var self = this;

			self.$loader.show();
			$.ajax({
				url: "/auth/user/",
				type:"POST",
				dataType:"json",
				async: false,
				data:{
					email: self.email,
					password: self.password,
					devType: 'Web'
				}
			}).done(function( data ) {
				console.log(data);
				self.assignToken(data);
				window.location = '/ingredients';
				// self.startApp(data);
			}).fail(function() {
			});
		},
		/**************************************************
		**              End Facebook Login
		**************************************************/
		/**************************************************
		**              Facebook Login
		**************************************************/
		getConfig: function () {
			var self = this;

			$.ajax({
				url: "/config/list",
				type:"GET",
				headers: { 
					"Authorization": self.access_token
				},
				dataType:"json",
			}).done(function( data ) {
				console.log(data.collection);
				// users = JSON.stringify(data);
				self.configuration = data.collection;
			}).fail(function() {
				console.log('fail get config');
			});
		},
		/**************************************************
		**              End Facebook Login
		**************************************************/
		/**************************************************
		**				Assign Access Token
		**************************************************/
		assignToken: function(data) {
			var self = this;

			self.access_token = data.access_token;
			self.refresh_token = data.refresh_token;
			window.localStorage.setItem('access_token', self.access_token);
			window.localStorage.setItem('refresh_token', self.refresh_token);
		},
		/**************************************************
		**			End Assign Access Token
		**************************************************/
		/**************************************************
		**			Remove Access Token
		**************************************************/
		removeToken: function() {
				var self = this;

				self.access_token = '';
				self.refresh_token = '';
				window.localStorage.removeItem('access_token');
				window.localStorage.removeItem('refresh_token');
		},
		/**************************************************
		**                  End Assign Access Token
		**************************************************/
		/**************************************************
		**              User Data
		**************************************************/
		userData: function (value) {
			var self = this;

			self.$username.find('a').attr('href', '/users/edit/' + value._id).text(value.firstname + ' ' + value.lastname);
			(typeof value.avatar !== 'undefined') ? self.$userimg.attr('src', '/uploads/' + value.avatar[0].file) : '';
		}
		/**************************************************
		**				End User Data
		**************************************************/
};

// document.addEventListener("deviceready", onDeviceReady, false);

var auth = new Auth();
