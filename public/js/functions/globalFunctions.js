		var nua = navigator.userAgent;
		var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

		var Main = function () {

		/**************************************************
										Begin Selectors
		**************************************************/
function init_SmartWizard(){
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
										End Variables
		**************************************************/

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

		this.init();
};

	Main.prototype = {
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
			self.$userimg.attr('src', value.avatar);
		},
		/**************************************************
		**				End User Data
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
		getRelated: function (value) {
			var self = this;

			$.ajax({
				url: "/config/related",
				type:"GET",
				async: false,
				headers: { 
					"Authorization": self.access_token
				},
				dataType:"json",
			}).done(function( data ) {
				self.config = data;
				window.localStorage.setItem('config', JSON.stringify(self.config));
				// users = JSON.stringify(data);
				// self.companies = data.company;

				// $.each(self.companies, function (i, item) {
				// 		self.companies_id.push({compid: item._id, titlename: item.titlename});
				// });

				// window.localStorage.setItem('companies', JSON.stringify(self.companies_id));

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
		},
		/**************************************************
		**              End Generate Refresh Token
		**************************************************/
		/**************************************************
		**        Begin to CamelCase
		**************************************************/
		toCamelCase: function (str) {
			return str
			.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
			.replace(/\s/g, '')
			.replace(/^(.)/, function($1) { return $1.toLowerCase(); });
		},
		/**************************************************
		**        End to CamelCase
		**************************************************/
		/**************************************************
		* Begin Get Collection Index
		* @param 	{Object} 	collection 			The main Object
		* @param 	{Number} 	collectionID 		The searched id
		* @return 	{Number} 				 		The index of the Object with the specified ID
		**************************************************/
		getIndex: function (collection, collectionID) {
			var self = this;

			// var index = company.collection.findIndex(compEl => compEl._id === companyID);
			var collectionIndex = collection.findIndex(collectionEl => collectionEl._id === collectionID);
			return collectionIndex;
		},
		/**************************************************
		**        End Get Collection Index
		**************************************************/
 		/**************************************************
		* Begin Object Assign
		* @param 	{Object} 	collection 			The main Object
		* @param 	{Number} 	index 				The index of the main Object
		* @param 	{String} 	nameAssigned 		The name container of the assigned object
		* @param 	{Object} 	objectAssigned 		The Object to be assigned
		**************************************************/
		objectAssign: function (collection, index, nameAssigned, objectAssigned) {
			var self = this;

			collection[index] = Object.assign({nameAssigned: objectAssigned}, collection[index])
		},
		/**************************************************
		**        End Object Assign
		**************************************************/
		/**************************************************
		**        Start Upload File
		**************************************************/
		uploadFile: function (selector, formName) {
			var self = this;

			var myFile = 'myFile';
			if (typeof selector[0] !== 'undefined') {
				$.each(selector[0].files, function(i, file) {
					var dataForm = new FormData();
					dataForm.append(myFile, file);
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
								$.each(data, function(i, item) {
									$('.uploadedFiles').append('<input value="' + item.filename + '" name="' + formName + '_name" type="hidden">' +
										'<input value="' + item.filename + '" name="' + formName + '_file" type="hidden">' +
										'<input value="' + item._id + '" name="' + formName + '_id" type="hidden">' +
										'<input value="' + self.today + '" name="' + formName + '_date" type="hidden">');
								});
							// 	$('.uploadedFiles .' + formName + '_name').val(data.filename);
							// 	$('.uploadedFiles .' + formName + '_file').val(data.originalname);
							// 	$('.uploadedFiles .' + formName + '_name').val(data.file.filename);
							// 	$('.uploadedFiles .' + formName + '_file').val(data.file.originalname);
							// (allLoaded) ? self.registerLinea() : '';
						}
					});
				});
			}
		},
		/**************************************************
		**        End Upload File
		**************************************************/
		/**************************************************
		**        Start Upload File
		**************************************************/
		register: function (collection, serializedArr, selector, formName) {
			var self = this;

			self.overlay.fadeIn();

			$.ajax({
				url: '/' + collection + '/register',
				type:"POST",
				headers: { 
					"Authorization": self.access_token
				},
				dataType:"json",
				async: false,
				data: serializedArr,
				success:function(data){
					socketio.sendNodeNotification(
						parent_company,
						form.find('#status').val(),
						form.find('#comment').val(),
						'/images/userImage.png',
						category
					);
					console.log('success');
					console.log(data);
					window.location.href = '/notification';
					//whatever you wanna do after the form is successfully submitted
				},
				fail:function(data) {
					console.log('fail');
				}
			});
			self.overlay.fadeOut();
		}
		/**************************************************
		**        End Upload File
		**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var main = new Main();
