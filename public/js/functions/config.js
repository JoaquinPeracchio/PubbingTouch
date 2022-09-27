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

		// this.init();
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
				(window.location.pathname != '/') ? window.location.href = "/" : '';
				self.initLogin();
			}
		},
		/**************************************************
		**					Auth
		**************************************************/
		isAuthorized: function() {
			var self = this;

			auth.access_token = window.localStorage.getItem('access_token');
			auth.refresh_token = window.localStorage.getItem('refresh_token');

			$.ajax({
				url: "/users/userinfo",
				type:"GET",
				async: false,
				headers: { 
					"Authorization": auth.access_token
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
					"Authorization": auth.access_token
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

			auth.access_token = data.access_token;
			auth.refresh_token = data.refresh_token;
			window.localStorage.setItem('access_token', auth.access_token);
			window.localStorage.setItem('refresh_token', auth.refresh_token);
		},
		/**************************************************
		**			End Assign Access Token
		**************************************************/
		/**************************************************
		**			Remove Access Token
		**************************************************/
		removeToken: function() {
				var self = this;

				auth.access_token = '';
				auth.refresh_token = '';
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
		},
		/**************************************************
		**				End User Data
		**************************************************/
		/**************************************************
		**              Sort by Letter
		**************************************************/
		confirmDelete: function(collection, collectionID) {
			var self = this;

			$.ajax({
				url: '/' + collection + '/delete/' + collectionID,
				method: 'POST',
				type:"POST",
				headers: { 
					"Authorization": auth.access_token
				},
				dataType:"json",
				success: function(data){
					console.log(data);
					$('.compid_' + data.deletedid).remove();
				}
			});
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
					"Authorization": auth.access_token
				},
				dataType:"json",
			}).done(function( data ) {
				self.collection = data;
				window.localStorage.setItem('config', JSON.stringify(self.collection));
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
					"Authorization": auth.access_token
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
		toFUppercase: function (str) {
			var str = str.charAt(0).toUpperCase() + str.slice(1);
			return str
		},
		/**************************************************
		**        End to CamelCase
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
		* Begin Get Notification
		* @param 	{Object} 	collection 			The main Object
		* @param 	{Number} 	collectionID 		The searched id
		* @return 	{Number} 				 		The index of the Object with the specified ID
		**************************************************/
		getNotification: function (collection) {
			var self = this;

			notification.appendTaskTopbar(
				self.$taskMenu,
				notification.get(
					collection._id,
					self.$taskMenu,
					'cumplimiento',
					'!aprobado'
				)
			);
			notification.appendNotificationTopbar(
				self.$notificationMenu,
				notification.get(
					collection._id,
					self.$notificationMenu,
					'notificacion',
					'!aprobado'
				)
			);
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

			// var index = company.companies.findIndex(compEl => compEl._id === companyID);
			var collectionIndex = collection.findIndex(collectionEl => collectionEl._id === collectionID);
			return collectionIndex;
		},
		/**************************************************
		**        End Get Collection Index
		**************************************************/
		/**************************************************
		* Begin Get Collection Index
		* @param 	{Object} 	collection 			The main Object
		* @param 	{Number} 	property 			The property
		* @param 	{String} 	value 				The searched value
		* @return 	{Number} 				 		The index of the Object with the specified ID
		**************************************************/
		getIndexParam: function (collection, property, value) {
			var self = this;

			for(var i = 0; i < collection.length; i += 1) {
				if(collection[i][property] === value) {
					    return i;
				}
			}
			// if doesn't exist return -1
			return -1;
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

			collection[index] = Object.assign({[nameAssigned]: objectAssigned}, collection[index])
		},
		/**************************************************
		**        End Object Assign
		**************************************************/
		/**************************************************
		* Begin Check Local Storage
		* @param 	{Object} 	collection 			The main Object
		* @param 	{Number} 	index 				The index of the main Object
		* @param 	{String} 	nameAssigned 		The name container of the assigned object
		* @param 	{Object} 	objectAssigned 		The Object to be assigned
		**************************************************/

		checkLocalStorage: function (selectorID, parentCollection, nameAssigned, relatedArgs, callback) {
			var self = this;

			// if (!window.localStorage.getItem(nameAssigned + '-' + selector.data('id'))) {
			if (!window.localStorage.getItem(nameAssigned + '-' + selectorID)) {
				$.ajax({
					// url: window[nameAssigned].getRelated(selectorID),
					url: window[nameAssigned].getRelated(...relatedArgs),
					success: function() {
						self.objectAssign(parentCollection, self.getIndex(parentCollection, selectorID), nameAssigned, window[nameAssigned].collection);
						// window[nameAssigned].generateTabs(...generateArgs);
						// $.each(window[nameAssigned].collection, function(i, item) {
						// 	window[nameAssigned].generate(...generateArgs, item);
						// });
						(typeof callback !== 'undefined') ? callback(self.collection) : '';
					}
				})
			} else {
				window[nameAssigned].collection = JSON.parse(window.localStorage.getItem(nameAssigned + '-' + selectorID));
				self.objectAssign(parentCollection, self.getIndex(parentCollection, selectorID), nameAssigned, window[nameAssigned].collection);
				// window[nameAssigned].generateTabs(...generateArgs);
				// $.each(window[nameAssigned].collection, function(i, item) {
				// 	window[nameAssigned].generate(...generateArgs, item);
				// });
				(typeof callback !== 'undefined') ? callback(self.collection) : '';
			}
		},
		/**************************************************
		**        End Check Local Storage
		**************************************************/
		/**************************************************
		* Begin Check Local Storage
		* @param 	{Object} 	collection 			The main Object
		* @param 	{Number} 	index 				The index of the main Object
		* @param 	{String} 	nameAssigned 		The name container of the assigned object
		* @param 	{Object} 	objectAssigned 		The Object to be assigned
		**************************************************

		checkLocalStorage: function (selectorID, parentCollection, nameAssigned, generateArgs, relatedArgs, bindTabs) {
			var self = this;

			// if (!window.localStorage.getItem(nameAssigned + '-' + selector.data('id'))) {
			if (!window.localStorage.getItem(nameAssigned + '-' + selectorID)) {
				$.ajax({
					// url: window[nameAssigned].getRelated(selectorID),
					url: window[nameAssigned].getRelated(...relatedArgs),
					success: function() {
						self.objectAssign(parentCollection, self.getIndex(parentCollection, selectorID), nameAssigned, window[nameAssigned].collection);
						window[nameAssigned].generateTabs(...generateArgs);
						$.each(window[nameAssigned].collection, function(i, item) {
							window[nameAssigned].generate(...generateArgs, item);
						});
						(bindTabs) ? window[nameAssigned].bindTabs() : '';
					}
				})
			} else {
				window[nameAssigned].collection = JSON.parse(window.localStorage.getItem(nameAssigned + '-' + selectorID));
				self.objectAssign(parentCollection, self.getIndex(parentCollection, selectorID), nameAssigned, window[nameAssigned].collection);
				window[nameAssigned].generateTabs(...generateArgs);
				$.each(window[nameAssigned].collection, function(i, item) {
					window[nameAssigned].generate(...generateArgs, item);
				});
				(bindTabs) ? window[nameAssigned].bindTabs() : '';
			}
		},
		/**************************************************
		**        End Check Local Storage
		**************************************************/
		/**************************************************
		* Begin Clear Local Storage
		**************************************************/

		clearLocalStorage: function () {
			var self = this;

			var access_token = localStorage.getItem('access_token');
			var refresh_token = localStorage.getItem('refresh_token');
			localStorage.clear();
			localStorage.setItem('access_token',access_token);
			localStorage.setItem('refresh_token',refresh_token);
		},
		/**************************************************
		**        End Clear Local Storage
		**************************************************/
		/**************************************************
		* Begin Update Local Storage
		* @param 	{Object} 	collection 			The main Object
		* @param 	{Number} 	index 				The index of the main Object
		* @param 	{String} 	nameAssigned 		The name container of the assigned object
		* @param 	{Object} 	objectAssigned 		The Object to be assigned
		**************************************************/

		addLocalStorage: function (key, collection) {
			var self = this;

			if (window.localStorage.getItem(key)) {
				window.localStorage.setItem([key], JSON.stringify(window[collection].collection));
			}
		},
		/**************************************************
		**        End Object Assign
		**************************************************/
		/**************************************************
		* Begin Update Local Storage
		* @param 	{Object} 	collection 			The main Object
		* @param 	{Number} 	index 				The index of the main Object
		* @param 	{String} 	nameAssigned 		The name container of the assigned object
		* @param 	{Object} 	objectAssigned 		The Object to be assigned
		**************************************************/

		updateLocalStorage: function (parentComp, parent, collection, _id) {
			var self = this;
			var key = collection + '-' + parent;
			var generateArgs = [parentComp]
			if (parentComp !== parent) {
				generateArgs.push(parent);
			}

			if (window.localStorage.getItem(key)) {
				window[collection].getById(_id, function(result) {
					window[collection].collection.push(result);
					generateArgs.push(result);
					window.localStorage.setItem([key], JSON.stringify(window[collection].collection));
					window[collection].generate(...generateArgs);
				})
				console.log('not exist');
			}
		},
		/**************************************************
		**        End Object Assign
		**************************************************/
		/**************************************************
		**        Start File Options
		**************************************************/
		getStock: function (item, listItems, callback) {
			var self = this;
			var listItems;

			main.getRelated('stock', item._id, function(stockCollection){
				// (typeof storestock === 'undefined') ? window['storestock'] = [stockCollection] : console.log('defined');
				window['storestock'] = stockCollection;
				$.each(stockCollection, function (istock, itemstock) {
					// main.getById('products', itemstock.productId, function(productItem){
					if (!window.localStorage.getItem('productsID-' + itemstock.productId)){
						products.getById(itemstock.productId, function(productItem){
							productInfo = productItem;
							$.each(itemstock.variant, function (iVars, itemVars){
							var currProduct = productInfo.variant[iVars];
							(typeof callback !== 'undefined') ? callback(productInfo, currProduct, itemVars, window['storestock']) : '';
							// ingredients.appendStock($('#productList'), productInfo, currProduct, itemVars);
							})
						});
					} else {
						productInfo = JSON.parse(window.localStorage.getItem('productsID-' + itemstock.productId));
						$.each(itemstock.variant, function (iVars, itemVars){
						var currProduct = productInfo.variant[iVars];
						(typeof callback !== 'undefined') ? callback(productInfo, currProduct, itemVars, window['storestock']) : '';
						// ingredients.appendStock($('#productList'), productInfo, currProduct, itemVars);
						})
					}
					(main.getIndex(listItems, productInfo._id) === -1) ? listItems.push(productInfo) : '';
				});
			});
		},
		/**************************************************
		**        End Object Assign
		**************************************************/
		/**************************************************
		**        Start File Options
		**************************************************/
		cardProduct: function (selector, item, indexVariant) {
			var self = this;

			selector
			.append($('<div />', { 'class': 'col-xs-12 col-sm-6 col-md-3 col-lg-3 cardProduct','data-sku':item.variant[indexVariant].sku })
				.append($('<div />', { 'class': 'card' })
					.append($('<div />', { 'class': 'card-head' })
						.append($('<button />',{
							'class':'card-button',
							'type':'button'})
						.append($('<i />',{'class':'fa fa-remove'})))
						.append($('<img />', {
							'src': 'https://s5.postimg.cc/wy79025cz/nike_Logo_White.png',
							'alt': 'logo',
							'class': 'card-logo'
						}))
						.append($('<h2 />', { text: item.brand }))
						.append($('<div />', { 'class': 'product-detail' })
							.append($('<img />', {
								'src': item.variant[indexVariant].image,
								'alt': 'shoe',
								'class': 'product-img'
							}))
							.append($('<p />', { text: item.variant[indexVariant].description }))
						)
					)
					.append($('<div />', { 'class': 'card-body' })
						.append($('<div />', { 'class': 'product-desc' })
							.append($('<span />', { 'class': 'product-title', text: item.variant[indexVariant].titlename }))
							.append($('<div />', { 'class': 'product-caption noselect' })
								.append($('<label />', { text: 'Cantidad:' }))
								.append($('<div />', {
									// 'onclick': this.parentNode.querySelector('input[type=number]').stepDown(),
									'class': 'form-control btn-down'
								})
									.append($('<i />', { 'class': 'fa fa-angle-down' }))
								)
								.append($('<input />', {
									'type': 'number',
									'value': 1,
									'class': 'form-control valid quantity'
								}))
								.append($('<div />', {
									// 'onclick': this.parentNode.querySelector('input[type=number]').stepUp(),
									'class': 'form-control btn-up'
								})
									.append($('<i />', { 'class': 'fa fa-angle-up' }))
								)
							)
						)
					)
					.append($('<div />', { 'class': 'card-footer' })
						.append($('<div />', { 'class': 'priceBadge' })
							.append($('<i />', { 'class': 'fa fa-usd' }))
							.append($('<span />', { 'class': 'buyPrice', text: 90 , 'data-buy': 90 }))
							.append($('<i />', { 'class': 'fa fa-usd' }))
							.append($('<span />', { 'class': 'sellPrice', text: 150, 'data-sell': 150 }))
						)
					)
				)
			)

					// .append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					// 	.append($('<div />', { 'class': 'card-pf box border-color' })
					// 		.append($('<div />', { 'class': 'box-header no-padding text-center' })
					// 			.append($('<div />', { 'class': 'box-tools pull-right' })
					// 				.append($('<a />', { 'class': 'btn btn-box-tool btn-delete' })
					// 					.append($('<i />', { 'class': 'fa fa-remove'}))
					// 				)
					// 			)
					// 		)
					// 		.append($('<div />', { 'class': 'box-body no-padding text-center' })
					// 			.append($('<div />', { 'class': 'btn btn-app no-margin fc-grid', 'style': 'height: auto;' })
					// 				.prepend($('<label />', { text: 'Titulo' }))
					// 				.append($('<div />', { 'class': 'input-group' })
					// 					.append($('<span />', { 'class': 'input-group-addon' })
					// 						.prepend($('<i />', { 'class': 'fa fa-file' }))
					// 					)
					// 					.append($('<input />', { 'class': 'form-control title', 'placeholder': item.name, 'type': 'text', 'name': inputChanged.data('name') + '_name', 'value': item.name }))
					// 				)
					// 			)
					// 		)
					// 		.append($('<div />', { 'class': 'box-footer text-center' })
					// 			.append(
					// 			(documents) ?
					// 				$('<label />', {'for': inputChanged.data('name') + '_filetypes', text: 'Documento' })
					// 				.append($('<div />', { 'class': 'input-group' })
					// 					.append($('<span />', { 'class': 'input-group-addon' })
					// 						.prepend($('<i />', { 'class': 'fa fa-file' }))
					// 					)
					// 					.append($('<select />', { 'class': 'form-control documentacion capitalize', 'name': inputChanged.data('name') + '_filetypes' })
					// 						.append(
					// 							$.map(documents.filetypes, function(mapDoc, indexDoc) {
					// 								// Begin Dropdown Title
					// 								return $('<option />', { 'value': mapDoc, text: mapDoc })
					// 							})
					// 						)
					// 					)
					// 				)
					// 			:
					// 				$('<div />', { 'class': 'empty' })
					// 			)
					// 			.append($('<br />'))
					// 			.append(
					// 			(expiration) ?
					// 				$('<label />', { text: 'Vencimiento' })
					// 				.append($('<div />', { 'class': 'input-group date expiration' })
					// 					.append($('<span />', { 'class': 'input-group-addon' })
					// 						.prepend($('<i />', { 'class': 'fa fa-calendar' }))
					// 					)
					// 					.append($('<input />', { 'class': 'form-control expiration', 'type': 'date', 'name': inputChanged.data('name') + '_expiration' }))
					// 				)
					// 			:
					// 				$('<div />', { 'class': 'empty' })
					// 			)
					// 		)
					// 	)
					// )
			// 	});
			// });
		},
		/**************************************************
		**        End File Options
		**************************************************/
		/**************************************************
		**        Start File Options
		**************************************************/
		fileOptions: function (expiration, documents) {
			var self = this;

			// $("input:file").on('change', function (){
			$("input:file:not('.avatar')").on('change', function (){
				var inputChanged = $(this);
				console.log($(this)[0].files);
				$.each($(this)[0].files, function(i, item) {
					console.log(item);
					// inputChanged.parent()
					self.fileArr.push({'myFile': item});
					$('.newFiles')
					.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
						.append($('<div />', { 'class': 'card-pf box border-color' })
							.append($('<div />', { 'class': 'box-header no-padding text-center' })
								.append($('<div />', { 'class': 'box-tools pull-right' })
									.append($('<a />', { 'class': 'btn btn-box-tool btn-delete' })
										.append($('<i />', { 'class': 'fa fa-remove'}))
									)
								)
							)
							.append($('<div />', { 'class': 'box-body no-padding text-center' })
								.append($('<div />', { 'class': 'btn btn-app no-margin fc-grid', 'style': 'height: auto;' })
									.prepend($('<label />', { text: 'Titulo' }))
									.append($('<div />', { 'class': 'input-group' })
										.append($('<span />', { 'class': 'input-group-addon' })
											.prepend($('<i />', { 'class': 'fa fa-file' }))
										)
										.append($('<input />', { 'class': 'form-control title', 'placeholder': item.name, 'type': 'text', 'name': inputChanged.data('name') + '_name', 'value': item.name }))
									)
								)
							)
							.append($('<div />', { 'class': 'box-footer text-center' })
								.append(
								(documents) ?
									$('<label />', {'for': inputChanged.data('name') + '_filetypes', text: 'Documento' })
									.append($('<div />', { 'class': 'input-group' })
										.append($('<span />', { 'class': 'input-group-addon' })
											.prepend($('<i />', { 'class': 'fa fa-file' }))
										)
										.append($('<select />', { 'class': 'form-control documentacion capitalize', 'name': inputChanged.data('name') + '_filetypes' })
											.append(
												$.map(documents.filetypes, function(mapDoc, indexDoc) {
													// Begin Dropdown Title
													return $('<option />', { 'value': mapDoc, text: mapDoc })
												})
											)
										)
									)
								:
									$('<div />', { 'class': 'empty' })
								)
								.append($('<br />'))
								.append(
								(expiration) ?
									$('<label />', { text: 'Vencimiento' })
									.append($('<div />', { 'class': 'input-group date expiration' })
										.append($('<span />', { 'class': 'input-group-addon' })
											.prepend($('<i />', { 'class': 'fa fa-calendar' }))
										)
										.append($('<input />', { 'class': 'form-control expiration', 'type': 'date', 'name': inputChanged.data('name') + '_expiration' }))
									)
								:
									$('<div />', { 'class': 'empty' })
								)
							)
						)
					)
				});
			});
		},
		/**************************************************
		**        End File Options
		**************************************************/
		/**************************************************
		**        Start File Options
		**************************************************/
		skuVariant: function (expiration, documents) {
			var self = this;

			$('.newVariant')
			.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
				.append($('<div />', { 'class': 'card-pf box border-color' })
					.append($('<div />', { 'class': 'box-header no-padding text-center' })
						.append($('<div />', { 'class': 'box-tools pull-right' })
							.append($('<a />', { 'class': 'btn btn-box-tool btn-delete' })
								.append($('<i />', { 'class': 'fa fa-remove'}))
							)
						)
					)
					.append($('<div />', { 'class': 'box-body no-padding text-center' })
						.append($('<div />', { 'class': 'btn btn-app no-margin fc-grid', 'style': 'height: auto;' })
							.prepend($('<label />', { text: 'Producto' }))
							.append($('<div />', { 'class': 'input-group' })
								.append($('<span />', { 'class': 'input-group-addon' })
									.prepend($('<i />', { 'class': 'fa fa-file' }))
								)
										.append($('<input />', { 'class': 'form-control title', 'placeholder': 'Producto', 'type': 'text', 'name': 'variant_titlename' }))
							)
							.prepend($('<label />', { text: 'Codigo' }))
							.append($('<div />', { 'class': 'input-group' })
								.append($('<span />', { 'class': 'input-group-addon' })
									.prepend($('<i />', { 'class': 'fa fa-file' }))
								)
										.append($('<input />', { 'class': 'form-control title', 'placeholder': 'Codigo de Barra', 'type': 'text', 'name': 'variant_barcode' }))
							)
						)
						.append($('<div />', { 'class': 'btn btn-app no-margin fc-grid', 'style': 'height: auto;' })
							.prepend($('<label />', { text: 'Contenido Neto' }))
							.append($('<div />', { 'class': 'input-group' })
								.append($('<span />', { 'class': 'input-group-addon' })
									.prepend($('<i />', { 'class': 'fa fa-file' }))
								)
										.append($('<input />', { 'class': 'form-control title', 'placeholder': 'Contenido Neto', 'type': 'text', 'name': 'variant_tiem_content' }))
							)
						)
					)
					.append($('<div />', { 'class': 'box-footer text-center' })
						.append(
						(documents) ?
							$('<label />', {'for': inputChanged.data('name') + '_filetypes', text: 'Documento' })
							.append($('<div />', { 'class': 'input-group' })
								.append($('<span />', { 'class': 'input-group-addon' })
									.prepend($('<i />', { 'class': 'fa fa-file' }))
								)
								.append($('<select />', { 'class': 'form-control documentacion capitalize', 'name': inputChanged.data('name') + '_filetypes' })
									.append(
										$.map(documents.filetypes, function(mapDoc, indexDoc) {
											// Begin Dropdown Title
											return $('<option />', { 'value': mapDoc, text: mapDoc })
										})
									)
								)
							)
						:
							$('<div />', { 'class': 'empty' })
						)
						.append($('<br />'))
						.append(
						(expiration) ?
							$('<label />', { text: 'Vencimiento' })
							.append($('<div />', { 'class': 'input-group date expiration' })
								.append($('<span />', { 'class': 'input-group-addon' })
									.prepend($('<i />', { 'class': 'fa fa-calendar' }))
								)
								.append($('<input />', { 'class': 'form-control expiration', 'type': 'date', 'name': inputChanged.data('name') + '_expiration' }))
							)
						:
							$('<div />', { 'class': 'empty' })
						)
					)
				)
			)
		},
		/**************************************************
		**        End File Options
		**************************************************/
		/**************************************************
		**        Start Upload File
		**************************************************/
		selectedImage: function (input, target) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = function (e) {
					target.attr('src', e.target.result);
				}
				reader.readAsDataURL(input.files[0]);
			}
		},
		/**************************************************
		**        End File Options
		**************************************************/
		/**************************************************
		**        Start Upload File
		**************************************************/
		uploadAvatar: function (selector, formName, allLoaded) {
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
									$('.uploadedAvatar')
										// .append('<input value="' + item.originalname + '" name="' + formName + '_name" type="hidden">' +
										.append('<input class="file" value="' + item.filename + '" name="' + formName + '_file" type="hidden">' +
										'<input class="id" value="' + item._id + '" name="' + formName + '_id" type="hidden">' +
										'<input class="date" value="' + self.today + '" name="' + formName + '_date" type="hidden">');
								});

						}
					});
				});
			}
		},
		/**************************************************
		**        End list
		**************************************************/
		/**************************************************
		**        Start Upload File
		**************************************************/
		uploadFile: function (selector, formName) {
			var self = this;

			var myFile = 'myFile';
			// if (typeof selector[0] !== 'undefined') {
			// 	$.each(selector[0].files, function(i, file) {
			if (typeof self.fileArr !== 'undefined') {
				$.each(self.fileArr, function(i, file) {
					var dataForm = new FormData();
					dataForm.append(myFile, file.myFile);
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
									// $('.uploadedFiles').append('<input value="' + item.filename + '" name="' + formName + '_name" type="hidden">' +
									$('.uploadedFiles').append('<input value="' + item.filename + '" name="' + formName + '_file" type="hidden">' +
									'<input value="' + item._id + '" name="' + formName + '_id" type="hidden">' +
										'<input value="' + self.today + '" name="' + formName + '_date" type="hidden">');
								});
						}
					});
				});
			}
		},
		/**************************************************
		**        End Upload File
		**************************************************/
		/**************************************************
		**        Start Nutritional Info Input
		**************************************************/
		nutritionalInfo: function (container) {
			var self = this;

			container.append($('<div />', { 'class': 'properties collapse' })
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_calorias', 'class': 'pull-left', text: 'Calorias:' }))
					.append($('<input />', { 'id': 'prop_calorias', 'class': 'prop_calorias', 'name': 'calorias', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_proteinas', 'class': 'pull-left', text: 'Proteinas:' }))
					.append($('<input />', { 'id': 'prop_proteinas', 'class': 'prop_proteinas', 'name': 'proteinas', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_lipidos', 'class': 'pull-left', text: 'Lipidos:' }))
					.append($('<input />', { 'id': 'prop_lipidos', 'class': 'prop_lipidos', 'name': 'lipidos', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_agsaturados', 'class': 'pull-left', text: 'AG Saturados:' }))
					.append($('<input />', { 'id': 'prop_agsaturados', 'class': 'prop_agsaturados', 'name': 'agsaturados', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_agmonoinsaturados', 'class': 'pull-left', text: 'AG Monoinsaturados:' }))
					.append($('<input />', { 'id': 'prop_agmonoinsaturados', 'class': 'prop_agmonoinsaturados', 'name': 'agmonoinsaturados', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_agpoliinsaturados', 'class': 'pull-left', text: 'AG Poliinsaturados:' }))
					.append($('<input />', { 'id': 'prop_agpoliinsaturados', 'class': 'prop_agpoliinsaturados', 'name': 'agpoliinsaturados', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_omega3', 'class': 'pull-left', text: 'Omega 3:' }))
					.append($('<input />', { 'id': 'prop_omega3', 'class': 'prop_omega3', 'name': 'omega3', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_omega6', 'class': 'pull-left', text: 'Omega 6:' }))
					.append($('<input />', { 'id': 'prop_omega6', 'class': 'prop_omega6', 'name': 'omega6', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_colesterol', 'class': 'pull-left', text: 'Colesterol:' }))
					.append($('<input />', { 'id': 'prop_colesterol', 'class': 'prop_colesterol', 'name': 'colesterol', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_carbohidratos', 'class': 'pull-left', text: 'Carbohidratos:' }))
					.append($('<input />', { 'id': 'prop_carbohidratos', 'class': 'prop_carbohidratos', 'name': 'carbohidratos', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_fibra', 'class': 'pull-left', text: 'Fibra:' }))
					.append($('<input />', { 'id': 'prop_fibra', 'class': 'prop_fibra', 'name': 'fibra', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_agua', 'class': 'pull-left', text: 'Agua:' }))
					.append($('<input />', { 'id': 'prop_agua', 'class': 'prop_agua', 'name': 'agua', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_calcio', 'class': 'pull-left', text: 'Calcio:' }))
					.append($('<input />', { 'id': 'prop_calcio', 'class': 'prop_calcio', 'name': 'calcio', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_hierro', 'class': 'pull-left', text: 'Hierro:' }))
					.append($('<input />', { 'id': 'prop_hierro', 'class': 'prop_hierro', 'name': 'hierro', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_yodo', 'class': 'pull-left', text: 'Yodo:' }))
					.append($('<input />', { 'id': 'prop_yodo', 'class': 'prop_yodo', 'name': 'yodo', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_magnesio', 'class': 'pull-left', text: 'Magnesio:' }))
					.append($('<input />', { 'id': 'prop_magnesio', 'class': 'prop_magnesio', 'name': 'magnesio', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_zinc', 'class': 'pull-left', text: 'Zinc:' }))
					.append($('<input />', { 'id': 'prop_zinc', 'class': 'prop_zinc', 'name': 'zinc', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_sodio', 'class': 'pull-left', text: 'Sodio:' }))
					.append($('<input />', { 'id': 'prop_sodio', 'class': 'prop_sodio', 'name': 'sodio', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_potasio', 'class': 'pull-left', text: 'Potasio:' }))
					.append($('<input />', { 'id': 'prop_potasio', 'class': 'prop_potasio', 'name': 'potasio', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_fosforo', 'class': 'pull-left', text: 'Fosforo:' }))
					.append($('<input />', { 'id': 'prop_fosforo', 'class': 'prop_fosforo', 'name': 'fosforo', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_selenio', 'class': 'pull-left', text: 'Selenio:' }))
					.append($('<input />', { 'id': 'prop_selenio', 'class': 'prop_selenio', 'name': 'selenio', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_tiamina', 'class': 'pull-left', text: 'Tiamina:' }))
					.append($('<input />', { 'id': 'prop_tiamina', 'class': 'prop_tiamina', 'name': 'tiamina', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_riboflavina', 'class': 'pull-left', text: 'Riboflavina:' }))
					.append($('<input />', { 'id': 'prop_riboflavina', 'class': 'prop_riboflavina', 'name': 'riboflavina', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_niacina', 'class': 'pull-left', text: 'Niacina:' }))
					.append($('<input />', { 'id': 'prop_niacina', 'class': 'prop_niacina', 'name': 'niacina', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_vitamina_b6', 'class': 'pull-left', text: 'Vitamina B6:' }))
					.append($('<input />', { 'id': 'prop_vitamina_b6', 'class': 'prop_vitamina_b6', 'name': 'vitamina_b6', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_folatos', 'class': 'pull-left', text: 'Folatos:' }))
					.append($('<input />', { 'id': 'prop_folatos', 'class': 'prop_folatos', 'name': 'folatos', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_vitamina_b12', 'class': 'pull-left', text: 'Vitamina B12:' }))
					.append($('<input />', { 'id': 'prop_vitamina_b12', 'class': 'prop_vitamina_b12', 'name': 'vitamina_b12', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_vitamina_c', 'class': 'pull-left', text: 'Vitamina C:' }))
					.append($('<input />', { 'id': 'prop_vitamina_c', 'class': 'prop_vitamina_c', 'name': 'vitamina_c', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_vitamina_a', 'class': 'pull-left', text: 'Vitamina A:' }))
					.append($('<input />', { 'id': 'prop_vitamina_a', 'class': 'prop_vitamina_a', 'name': 'vitamina_a', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_vitamina_d', 'class': 'pull-left', text: 'Vitamina D:' }))
					.append($('<input />', { 'id': 'prop_vitamina_d', 'class': 'prop_vitamina_d', 'name': 'vitamina_d', 'type': 'text' }))
				)
				.append($('<div />', { 'class': 'col-xs-4 col-sm-4 col-md-4 col-lg-4' })
					.append($('<label />', { 'for': 'prop_vitamina_e', 'class': 'pull-left', text: 'Vitamina E:' }))
					.append($('<input />', { 'id': 'prop_vitamina_e', 'class': 'prop_vitamina_e', 'name': 'vitamina_e', 'type': 'text' }))
				)
			)
		},
		/**************************************************
		**        End Nutritional Info Input
		**************************************************/
		/**************************************************
		**        Start Fill Nutritional Info
		**************************************************/
		fillNutritional: function (container, selected) {
			var self = this;

			container.find('.prop_calorias').val(selected.nutricional[0].calorias);
			container.find('.prop_proteinas').val(selected.nutricional[0].proteinas);
			container.find('.prop_lipidos').val(selected.nutricional[0].lipidos);
			container.find('.prop_agsaturados').val(selected.nutricional[0].agsaturados);
			container.find('.prop_agmonoinsaturados').val(selected.nutricional[0].agmonoinsaturados);
			container.find('.prop_agpoliinsaturados').val(selected.nutricional[0].agpoliinsaturados);
			container.find('.prop_omega3').val(selected.nutricional[0].omega3);
			container.find('.prop_omega6').val(selected.nutricional[0].omega6);
			container.find('.prop_colesterol').val(selected.nutricional[0].colesterol);
			container.find('.prop_carbohidratos').val(selected.nutricional[0].carbohidratos);
			container.find('.prop_fibra').val(selected.nutricional[0].fibra);
			container.find('.prop_agua').val(selected.nutricional[0].agua);
			container.find('.prop_calcio').val(selected.nutricional[0].calcio);
			container.find('.prop_hierro').val(selected.nutricional[0].hierro);
			container.find('.prop_yodo').val(selected.nutricional[0].yodo);
			container.find('.prop_magnesio').val(selected.nutricional[0].magnesio);
			container.find('.prop_zinc').val(selected.nutricional[0].zinc);
			container.find('.prop_sodio').val(selected.nutricional[0].sodio);
			container.find('.prop_potasio').val(selected.nutricional[0].potasio);
			container.find('.prop_fosforo').val(selected.nutricional[0].fosforo);
			container.find('.prop_selenio').val(selected.nutricional[0].selenio);
			container.find('.prop_tiamina').val(selected.nutricional[0].tiamina);
			container.find('.prop_riboflavina').val(selected.nutricional[0].riboflavina);
			container.find('.prop_niacina').val(selected.nutricional[0].niacina);
			container.find('.prop_vitamina_b6').val(selected.nutricional[0].vitamina_b6);
			container.find('.prop_folatos').val(selected.nutricional[0].folatos);
			container.find('.prop_vitamina_b12').val(selected.nutricional[0].vitamina_b12);
			container.find('.prop_vitamina_c').val(selected.nutricional[0].vitamina_c);
			container.find('.prop_vitamina_a').val(selected.nutricional[0].vitamina_a);
			container.find('.prop_vitamina_d').val(selected.nutricional[0].vitamina_d);
			container.find('.prop_vitamina_e').val(selected.nutricional[0].vitamina_e);
		},
		/**************************************************
		**        End Fill Nutritional Info
		**************************************************/
		/**************************************************
		**        Start Upload File
		**************************************************/
		submit: function (collection, mode, serializedArr, callback) {
			var self = this;

			self.overlay.fadeIn();
			var result;

			if (mode == 'edit') {
				var edit_id = window.location.pathname;
				mode = 'update/' + edit_id.substring(edit_id.lastIndexOf('/')+1);
			// } else {
			// 	mode = 'register';
			}

			$.ajax({
				url: '/' + collection + '/' + mode,
				type:"POST",
				headers: { 
					"Authorization": auth.access_token
				},
				dataType:"json",
				async: false,
				data: serializedArr,
				success:function(data){
					result = data;
				},
				fail:function(data) {
					result = data;
				}
			});
			(typeof callback !== 'undefined') ? callback(result) : '';
		},
		/**************************************************
		**        End Upload File
		**************************************************/
		/**************************************************
		* Begin Autocomplete
		* @param 	{String} 	filterCont 			The container of filtered items
		* @param 	{Object} 	collection 			The main Object to search for
		* @param 	{String} 	listCont 			The search result container
		* @param 	{String} 	sortBy 				The object element to filter
		* @param 	{Function} 	callback 			The callback function to regenerate element list
		* @param 	{event} 	onSelect 			Event listener on selected item
		* @param 	{integrer} 	countItems 			The amount of items matched
		**************************************************/
		autocomplete: function (filterCont, collection, listCont, sortBy, maxResult, callback, onSelect, countItems) {
			var self = this;

			var collection,
				listCont,
				filterString,
				filterFlag

			$(document).on('change', sortBy, function() {
				main.sortProperties(collection, sortBy);
			});
				filterString = filterCont.val().toLowerCase();
				if (filterCont.length && filterCont.val().length) {
					filterFlag = true;
				} else {
					filterFlag = false;
				}
				listCont.empty();
				if (filterFlag) {
					var count = 0;
					// matchAny = String('\\b' + (filterString.split(" ").join('|')) + '\/g');
					matchAny = String("(?=.*?\\b" + filterString.split(" ").join(")|(?=.*?\\b") + ")", "i");
					matchRegex = String('(?=.*'+ (filterString.split(" ").join(')(?=.*')) +')');
					console.log(matchAny);
					console.log(matchRegex);
					if (sortBy == 'barcode') {
						console.log('barcode');
						$.each(collection, function (i, item) {
							if (count >= maxResult) { return false; }
							$.each(item.variant, function (i, itemProduct) {
								if (count >= maxResult) { return false; }
								var matchedItem = String(itemProduct['barcode']).match(matchRegex);
								// if (String(itemProduct[sortBy.val()]).toLowerCase().match(filterString)) {
								if (matchedItem) {
									console.log('matchedItem', matchedItem);
									callback(listCont, itemProduct, sortBy, item);
									count += 1;
								}
							});
						});
					} else {
						$.each(collection, function (i, item) {
							if (count >= maxResult) { return false; }
							var matchedItem = String(item[sortBy]).toLowerCase().match(matchAny);
							// if (String(item[sortBy.val()]).toLowerCase().match(filterString)) {
							if (matchedItem) {
								console.log('matchedItem', matchedItem);
								$.each(item.variant, function (i, itemProduct) {
									if (count >= maxResult) { return false; }
									var matchedItem = String(itemProduct[sortBy]).toLowerCase().match(matchRegex);
									// if (String(itemProduct[sortBy.val()]).toLowerCase().match(filterString)) {
									if (matchedItem) {
										console.log('matchedItem', matchedItem);
										callback(listCont, itemProduct, sortBy, item);
										count += 1;
									}
								});
							}
						});
					}
					countItems(listCont, count);
				} else {
					listCont.empty();
					listCont.hide();
				}
				// $(document).on('click', listCont.children(), function() {
				// 	console.log(listCont);
				// 	console.log($(this));
				// 	onSelect(listCont, $(this), filterCont);
				// })
		},
		/**************************************************
		**        End Autocomplete
		**************************************************/
		/**************************************************
		* Begin Autocomplete
		* @param 	{String} 	filterCont 			The container of filtered items
		* @param 	{Object} 	collection 			The main Object to search for
		* @param 	{String} 	listCont 			The search result container
		* @param 	{String} 	sortBy 				The object element to filter
		* @param 	{Function} 	callback 			The callback function to regenerate element list
		* @param 	{event} 	onSelect 			Event listener on selected item
		* @param 	{integrer} 	countItems 			The amount of items matched
		**************************************************
		autocomplete: function (filterCont, collection, listCont, sortBy, maxResult, callback, onSelect, countItems) {
			var self = this;

			var collection,
				listCont,
				filterString,
				filterFlag

			$(document).on('change', sortBy, function() {
				main.sortProperties(collection, sortBy);
			});
				filterString = filterCont.val();
				if (filterCont.length && filterCont.val().length) {
					filterFlag = true;
				} else {
					filterFlag = false;
				}
				listCont.empty();
				if (filterFlag) {
					var count = 0;
					matchRegex = String('(?=.*'+ (filterString.split(" ").join(')(?=.*')) +')');
					console.log(matchRegex);
					$.each(collection, function (i, item) {
						if (count >= maxResult) { return false; }
						var matchedItem = String(item[sortBy]).toLowerCase().match(matchRegex);
						// if (String(item[sortBy.val()]).toLowerCase().match(filterString)) {
						if (matchedItem) {
							callback(listCont, item, sortBy);
							count += 1;
						}
					});
					countItems(listCont, count);
				} else {
					listCont.empty();
					listCont.hide();
				}
				listCont.children().on('click', function() {
					console.log(listCont);
					console.log($(this));
					onSelect(listCont, $(this), filterCont);
				})
		},
		/**************************************************
		**        End Autocomplete
		**************************************************/
		/**************************************************
		**        Start Clipboard
		**************************************************/
		clipboard: function (copyEl) {
			var self = this;
			var value = copyEl; //Upto this I am getting value
			var $temp = $("<input>");

			$('body').append($temp);
			$temp.val(value).select();
			document.execCommand('copy');
			$temp.remove();
		},
		/**************************************************
		**        End Clipboard
		**************************************************/
		/**************************************************
		**        Start Clipboard
		**************************************************/
		getAll: function (colName, idEl, callback) {
			var self = this;
			// var element = element;

			$.ajax({
				url: '/' + colName + '/list',
				type:"GET",
				async: false,
				dataType:"json"
			}).done(function( data ) {
				console.log(data.collection);
				self.collection = data.collection;
				var key = colName + '-' + idEl;
				if (Array.isArray(self.collection) && self.collection.length != 0) {
					window.localStorage.setItem([key], JSON.stringify(self.collection));
					main.functionsObj[colName] = colName;
				}
				(typeof callback !== 'undefined') ? callback(self.collection) : '';
				// var index = company.collection.findIndex(compEl => compEl._id === idEl);
				// console.log(index);
				// company.collection[index] = Object.assign({'lineas': self.collection}, company.collection[index])
				// self.generate(element, index, idEl, directAppend);
				// $('.menu .item').tab();
			}).fail(function() {
				main.removeToken();
				main.initLogin();
				self.$loader.hide();
				(typeof callback !== 'undefined') ? callback(self.collection) : '';
			});
		},
		/**************************************************
		**        End Clipboard
		**************************************************/
		/**************************************************
		**        Start Clipboard
		**************************************************/
		getRelated: function (colName, idEl, callback) {
			var self = this;
			// var element = element;

			$.ajax({
				url: '/' + colName + '/related',
				type:"POST",
				async: false,
				headers: { 
					"Authorization": auth.access_token
				},
				dataType:"json",
				data: {
					relatedEl: idEl
				}
			}).done(function( data ) {
				console.log(data.collection);
				self.collection = data.collection;
				var key = colName + '-' + idEl;
				if (Array.isArray(self.collection) && self.collection.length != 0) {
					window.localStorage.setItem([key], JSON.stringify(self.collection));
					main.functionsObj[colName] = colName;
				}
				(typeof callback !== 'undefined') ? callback(self.collection) : '';
				// var index = company.collection.findIndex(compEl => compEl._id === idEl);
				// console.log(index);
				// company.collection[index] = Object.assign({'lineas': self.collection}, company.collection[index])
				// self.generate(element, index, idEl, directAppend);
				// $('.menu .item').tab();
			}).fail(function() {
				main.removeToken();
				main.initLogin();
				self.$loader.hide();
				(typeof callback !== 'undefined') ? callback(self.collection) : '';
			});
		},
		/**************************************************
		**        End Clipboard
		**************************************************/
		/**************************************************
		**        Start Get no-Auth
		**************************************************/
		getSearch: function (colName, searchText, callback) {
			var self = this;
			// var element = element;

			$.ajax({
				url: '/' + colName + '/search',
				type:"POST",
				async: false,
                data: {
					search: searchText
				},
				dataType:"json"
			}).done(function( data ) {
				console.log(data.collection);
				self.collection = data.collection;
				$.each(self.collection, function(i, item){
					var key = colName + 'ID-' + item._id;
					if (Array.isArray(self.collection) && self.collection.length != 0) {
						window.localStorage.setItem([key], JSON.stringify(self.collection[i]));
						main.functionsObj[colName] = colName;
					}
				});
				(typeof callback !== 'undefined') ? callback(self.collection) : '';
			}).fail(function() {
				self.$loader.hide();
				(typeof callback !== 'undefined') ? callback(self.collection) : '';
			});
		},
		/**************************************************
		**        End Clipboard
		**************************************************/
		/**************************************************
		**        Start Clipboard
		**************************************************/
		getById: function (colName, idEl, callback) {
			var self = this;
			// var element = element;

			$.ajax({
				url: '/' + colName + '/find/' + idEl,
				type:"POST",
				async: false,
				headers: { 
					"Authorization": auth.access_token
				},
				dataType:"json"
			}).done(function( data ) {
				console.log(data.collection);
				self.collection = data.collection;
				var key = colName + '-' + idEl;
				if (Array.isArray(self.collection) && self.collection.length != 0) {
					window.localStorage.setItem([key], JSON.stringify(self.collection));
					main.functionsObj[colName] = colName;
				}
				(typeof callback !== 'undefined') ? callback(self.collection) : '';
				// var index = company.collection.findIndex(compEl => compEl._id === idEl);
				// console.log(index);
				// company.collection[index] = Object.assign({'lineas': self.collection}, company.collection[index])
				// self.generate(element, index, idEl, directAppend);
				// $('.menu .item').tab();
			}).fail(function() {
				main.removeToken();
				main.initLogin();
				self.$loader.hide();
				(typeof callback !== 'undefined') ? callback(self.collection) : '';
			});
		},
		/**************************************************
		**        End Clipboard
		**************************************************/
		/**************************************************
		**        End Autocomplete
		**************************************************/
		findArr: function (collection, value) {
			var found = collection.find(selEl => selEl._id === value);
			return found;
		},
		/**************************************************
		**              Begin append products
		**************************************************/
		appendUsers: function (element, item) {
			var self = this;

			var   avatarLength = item.avatar.length,
			      indexAvatar = parseInt(item.avatar.length) - 1,
			      indexAvatarSub,
			      fileAvatar = item.avatar[indexAvatar];

			if (fileAvatar instanceof Array && typeof fileAvatar.filename === 'undefined') {
				indexAvatarSub = parseInt(fileAvatar.length) -1;
				fileAvatar = fileAvatar[indexAvatarSub];
			}

			(typeof fileAvatar !== 'undefined') ? fileAvatar = fileAvatar.file : fileAvatar = 'userImage.png';

			element.append($('<li />', {
				'class': 'col-xs-12 col-sm-6 col-md-6 col-lg-6 item-product',
				'data-id': item._id,
				'style': 'border-radius: 10px; margin-bottom: 10px;'
			})
				.append($('<div />', { 'class': 'bg-white', 'style': 'background: #efefef; border-radius: 10px; box-shadow: -1px 1px 5px #777777;' })
					.append($('<div />', { 'class': 'col-xs-3 col-sm-3 col-md-3 col-lg-3 no-padding' })
						.append($('<img />', { 'class': 'profile-user-img img-responsive img-circle', 'src': '/uploads/' + fileAvatar }))
						// .append($('<img />', { 'class': 'img-circle', 'src': item.image, 'style': 'width: 100% !important;border-radius: 10px; border: 1px solid #fff;', 'alt': 'Imagen de Producto' }))
					)
					.append($('<div />', { 'class': 'col-xs-9 col-sm-9 col-md-9 col-lg-9' })
						.append($('<p />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12 no-padding no-margin text-left' })
							.append($('<span />', { 'class': 'col-xs-6 col-sm-6 col-md-6 col-lg-6 no-padding', text : item.username })
							)
							.append($('<span />', { 'class': 'col-xs-6 col-sm-6 col-md-6 col-lg-6 no-padding text-right', text : item.dialCode + '-' + item.phone })
							)
						)
						.append($('<p />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12 no-padding', text : item.lastname + ', ' + item.firstname })
						)
						.append($('<p />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12 no-padding no-margin text-left', text : item.address + ', ' + item.department })
						)
						.append($('<p />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12 no-padding text-left', text : item.city + ', ' + item.region + ', ' + item.country })
						)
						.append($('<p />', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12 no-padding text-right', text : item.email })
						)
					)
					.append($('<div />', { 'class': 'input-group' })
						.append($('<input />', { 'name': 'staff_user', 'type': 'hidden', 'value': item._id }))
						.append($('<select />', { 'name': 'role', 'class': 'form-control chosen-select' })
							.append($('<option />', { text: 'Administrador', 'value': 'admin' }))
							.append($('<option />', { text: 'Cajero', 'value': 'cashier' }))
							.append($('<option />', { text: 'Delivery', 'value': 'delivery' }))
						)
					)
					.append($('<hr />', { 'class': 'clear' }))
				)
			)
		},
		/**************************************************
		**              Begin append products
		**************************************************/
		appendProducts: function (element, productItem, currProduct, itemVars) {
			var self = this;

			element.append($('<li />', {
				'class': 'col-xs-12 col-sm-6 col-md-6 col-lg-6 item-product',
				'data-id': productItem._id,
				'data-sku': currProduct.sku,
				'style': 'border-radius: 10px; margin-bottom: 10px;'
			})
				.append($('<div />', { 'class': 'bg-white', 'style': 'background: #efefef; border-radius: 10px; box-shadow: -1px 1px 5px #777777;' })
					.append($('<div />', { 'class': 'col-xs-3 col-sm-3 col-md-3 col-lg-3 no-padding' })
						.append($('<img />', { 'class': 'img-circle', 'src': currProduct.image, 'style': 'width: 100% !important;border-radius: 10px; border: 1px solid #fff;', 'alt': 'Imagen de Producto' }))
					)
					.append($('<div />', { 'class': 'col-xs-9 col-sm-9 col-md-9 col-lg-9' })
						.append($('<h3 />', { 'class': 'price' })
							.append($('<span />', { 'class': 'col-xs-2 col-sm-2 col-md-2 col-lg-2 no-padding text-left', text : itemVars.price })
								.prepend($('<i />', { 'class': 'fa fa-dollar' }))
							)
							.append($('<span />', { 'class': 'col-xs-8 col-sm-8 col-md-8 col-lg-8 no-padding text-center', text : 'Producto del día' })
								.prepend($('<i />', { 'class': 'fa fa-star' }))
							)
							.append($('<span />', { 'class': 'col-xs-2 col-sm-2 col-md-2 col-lg-2 no-padding text-right', text : itemVars.stock })
								.prepend($('<i />', { 'class': 'fa fa-bar-chart' }))
							)
						)
						.append($('<h2 />', { 'class': 'titlename no-margin', text: currProduct.titlename }))
						.append($('<p />', { 'class': 'description no-margin', text: currProduct.description }))
					)
					.append($('<hr />', { 'class': 'clear' }))
				)
			)
		}
		/**************************************************
		**              End Append stock
		**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var main = new Main();
