		var nua = navigator.userAgent;
		var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

		var Main = function () {

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
		this.$topbar = $('.topbar');
				this.$addItem = this.$topbar.find('.addItem');
				this.$username = this.$topbar.find('.username');
				this.$userimg = this.$topbar.find('.userimg');
				this.$logout = this.$topbar.find('.logout');
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

		//  Page
		this.mode;

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

		this.init();
};

Main.prototype = {
		init: function () {
				var self = this;

				self.$addItem.attr('href', location.href + self.$addItem.attr('href'));
				self.mode = self.$body.data('mode');
				self.$loginButton.on('click', function(){
						self.$login.addClass('active');
				});
				if (window.localStorage.getItem('access_token')) {
						self.isAuthorized();
				} else {
						self.initLogin();
				}
				self.$loader.hide();
				self.sidebar();
		},
		/**************************************************
		**                      Assign Access Token
		**************************************************/
		assignToken: function(data) {
				var self = this;

				self.access_token = data.access_token;
				self.refresh_token = data.refresh_token;
				window.localStorage.setItem('access_token', self.access_token);
				window.localStorage.setItem('refresh_token', self.refresh_token);
		},
		/**************************************************
		**                  End Assign Access Token
		**************************************************/
		/**************************************************
		**                      Remove Access Token
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
						Auth
		**************************************************/
		isAuthorized: function() {
				var self = this;

				self.$loader.show();
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
						console.log(data);
						self.user = data;
						self.$login.hide();
						self.$loader.hide();
						self.startApp(data);
				}).fail(function() {
						self.removeToken();
						self.initLogin();
						self.$loader.hide();
						window.location.href = "/";
				});

		},
		/**************************************************
		**                      End Auth
		**************************************************/
		/**************************************************
		**                          Sidebar
		**************************************************/
		sidebar: function() {
				var self = this;

				self.$sidebarBtn.click(function(){
						self.$sidebar.toggleClass('active');
						self.$sidebarBtn.toggleClass('toggle');
				});
		},
		/**************************************************
		**              End Sidebar
		**************************************************/
		/**************************************************
		**                          Login Form
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
						data:{
								email: self.email,
								password: self.password,
								devType: 'Web'
						}
				}).done(function( data ) {
						console.log(data);
						self.assignToken(data);
						window.location = '/ingredients';
						// self.$login.hide();
						// self.$loader.hide();
						// self.startApp(data);
				}).fail(function() {
						// self.$login.show();
				});

		},
		/**************************************************
		**              End Facebook Login
		**************************************************/
		/**************************************************
		**              Sort by Letter
		**************************************************/
		sortProperties: function(obj, sortedBy, reverse) {
				var self = this;
				var sortedBy = sortedBy || 1; // by default first key
				var isNumericSort = isNumericSort || false; // by default text sort
				(typeof obj[0][sortedBy] == "number") ? isNumericSort = true : isNumericSort = false;
				var reverse = reverse || false; // by default no reverse

				// var reversed = (reverse) ? -1 : 1;
				var reversed = reverse;

				if (isNumericSort)
						obj.sort(function (a, b) {
								return reversed * (a[sortedBy] - b[sortedBy]);
						});
				else
						obj.sort(function (a, b) {
								var x = a[sortedBy].replace(/ /g,'').toLowerCase(),
										y = b[sortedBy].replace(/ /g,'').toLowerCase();
								return x < y ? reversed * -1 : x > y ? reversed : 0;
						});
				return obj; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
		},
		/**************************************************
		**              End User List
		**************************************************/
	/**************************************************
	**        Start getConfig
	**************************************************/
	getConfig: function (value) {
		var self = this;

		$.ajax({
			url: "/company/related",
			type:"GET",
			async: false,
			headers: { 
				"Authorization": self.access_token
			},
			dataType:"json",
		}).done(function( data ) {
				// users = JSON.stringify(data);
				self.companies = data.company;

				$.each(self.companies, function (i, item) {
						self.companies_id.push({compid: item._id, titlename: item.titlename});
				});

				window.localStorage.setItem('companies', JSON.stringify(self.companies_id));

				// $.each(self.companies, function (i, item) {
				//  self.getLineas(item._id, i);
				// });
				// $.each(self.companies, function (i, item) {
				//  $('.parent_linea').append('<div class="item id_' + item._id +'" data-company="' + item._id + '" data-value="' + item._id +'"">' + item.titlename + '</div>');
				// });
		}).fail(function() {
			console.log('fail get config');
		});
	},
	/**************************************************
	**        End getConfig
	**************************************************/
		/**************************************************
		**              Start App
		**************************************************/
		startApp: function (value) {
				var self = this;

				self.$username.text(value.firstname + ' ' + value.lastname);
				self.$userimg.css({ 'background-image': 'url(' + value.avatar + ')' });
				if ($('.ui.dropdown.item').length != 0) {
						$('.ui.dropdown.item').dropdown();
				}
				self.bindEvents();
				switch(self.mode) {
						case 'register':
								console.log('register');
								self.$loader.hide();
								break;
						case 'users':
								console.log('users');
								self.userFunctions();
								break;
						case 'tables':
								console.log('tables');
								self.tablesFunctions();
								break;
						case 'index':
								window.location = '/ingredients';
								break;
						default:
								console.log('default');
								break;
				}
				self.getConfig();
		},
		/**************************************************
		**              End Start App
		**************************************************/
		/**************************************************
		**              User Functions
		**************************************************/
		userFunctions: function (isAdmin) {
				var self = this;

				self.userList();
		},
		/**************************************************
		**              End User Functions
		**************************************************/
		/**************************************************
		**              User List
		**************************************************/
		userList: function () {
				var self = this;

				self.$loader.show();
				self.$userList.empty();

				$.ajax({
						url: "/users/list",
						type:"GET",
						headers: { 
								"Authorization": self.access_token
						},
						dataType:"json",
				}).done(function( data ) {
						self.users = data.users;
						self.sortProperties(data.users, self.$userSortBy.val(), self.$userSortOrder.val());
						self.populateUsers();
				}).fail(function() {
						self.removeToken();
						self.initLogin();
						self.$loader.hide();
				});
		},
		/**************************************************
		**              End User List
		**************************************************/
		/**************************************************
		**              Bind Events
		**************************************************/
		populateUsers: function (stringFilter) {
				var self = this;

				self.$userList.empty();
				if (self.userFilterFlag) {
						$.each(self.users, function (i, item) {
								if (String(item[self.$userSortBy.val()]).toLowerCase().match(self.userFilterString.toLowerCase())) {
										self.$userList.append('<div class="column">' +
												'<div class="ui cards">' +
														'<div class="card">' +
																'<div class="content">'+
																		'<img class="right floated mini ui image" src="' + self.users[i].avatar + '">'+
																		'<div class="header">' + self.users[i].username + '</div>'+
																		'<div class="meta">' + self.users[i].firstname + ' ' + self.users[i].lastname + '</div>'+
																		'<div class="description">' + self.users[i].transportCompany + '</div>'+
																		'<div class="description">' + self.users[i].email + '</div>'+
																'</div>'+
																'<div class="extra content">'+
																		'<div class="ui two buttons">'+
																				'<div class="ui basic green button">Approve</div>'+
																				'<div class="ui basic red button">Decline</div>'+
																		'</div>'+
																'</div>'+
														'</div>'+
												'</div>'+
										'</div>');
								}
						});
				} else {
						$.each(self.users, function (i, item) {
								self.$userList.append('<div class="column">' +
										'<div class="ui cards">' +
												'<div class="card">' +
														'<div class="content">'+
																'<img class="right floated mini ui image" src="' + self.users[i].avatar + '">'+
																'<div class="header">' + self.users[i].username + '</div>'+
																'<div class="meta">' + self.users[i].firstname + ' ' + self.users[i].lastname + '</div>'+
																'<div class="description">' + self.users[i].transportCompany + '</div>'+
																'<div class="description">' + self.users[i].email + '</div>'+
														'</div>'+
														'<div class="extra content">'+
																'<div class="ui two buttons">'+
																		'<div class="ui basic green button">Approve</div>'+
																		'<div class="ui basic red button">Decline</div>'+
																'</div>'+
														'</div>'+
												'</div>'+
										'</div>'+
								'</div>');
						});
				}
				self.$loader.hide();
		},
		/**************************************************
		**              End User List
		**************************************************/
		/**************************************************
		**              Bind Events
		**************************************************/
		bindEvents: function (value) {
				var self = this;

				self.$logout.on('click', function(){
						self.removeToken();
						window.location.href = "/";
				});
		},
		/**************************************************
		**              End Bind Events
		**************************************************/
		/**************************************************
		**              Has Hash Key
		**************************************************/
		hasHashKey: function (value) {
				var self = this;
		},
		/**************************************************
		**              End Hash Key
		**************************************************/
		/**************************************************
		**        Generate Refresh Token
		**************************************************/
		tokenEncrypt: function (facebookToken) {
				var self = this;

				self.watcha_token = CryptoJS.AES.encrypt(facebookToken, self.clientSecret).toString();
				// self.checkLatency();
				// self.powerOn(self.watcha_token);
		}
		/**************************************************
		**              End Generate Refresh Token
		**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var main = new Main();
