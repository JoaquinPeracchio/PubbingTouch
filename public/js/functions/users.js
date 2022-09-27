		var nua = navigator.userAgent;
		var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

		var Users = function () {

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
		this.$topbar = $('.navbar');
				this.$addItem = this.$topbar.find('.addItem');
				this.$username = this.$topbar.find('.username');
				this.$userimg = this.$topbar.find('.userimg');

				this.$userFilter = this.$topbar.find('.userFilter');
						this.$userSortSelect = this.$userFilter.find('select');
						this.$userSortBy = this.$userFilter.find('.sortBy');
						this.$userSortOrder = this.$userFilter.find('.sortOrder');
						this.$userFilterString = this.$userFilter.find('.stringFilter');
		// Login Page
		this.$loginButton = $('.loginButton');
		this.$login = $('#login');
				this.$emailInput = this.$login.find('.email');
				this.$passInput = this.$login.find('.password');
				this.$powerButton = this.$login.find('.submit');

		this.$form = $('#profileForm');

				this.$password = this.$form.find("#password"),
				this.$passwordMatch = this.$form.find("#password-match");

		this.$content = $('.wrapper');

		// Users Page
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
		this.mode = this.$body.data('mode');

		//  User
		this.email;
		this.password;

		this.collection;
		this.controller = 'users';
		this.userFilterString;
		this.userFilterFlag = false;

		this.companies;
		this.companyFilterString;
		this.companyFilterFlag = false;


		//  Login Token
		this.access_token = window.localStorage.getItem('access_token');

		this.configuration;
		this.roles = [];

		this.$btnDelete;

		this.init();
};

Users.prototype = {
		init: function () {
				var self = this;

				// self.$loader.hide();
				// self.bindEvents();
				// self.getConfig();
				// self.getCompany();
				// (self.mode == 'list') ? self.userFunctions() : self.bindRegister();
		},
		/**************************************************
		**                  Get Config
		**************************************************/
		getConfig: function() {
			var self = this;

			$.ajax({
				url: "/config/list",
				type:"GET",
				headers: { 
					"Authorization": self.access_token
				},
				dataType:"json",
			}).done(function( data ) {
				// users = JSON.stringify(data);
				self.configuration = data.configuration;
				// console.log(self.configuration[0].roles);
				// $.each(self.configuration[0].roles, function (i, item) {
				// 		$('.roles').append('<div class="item" data-value="' + item.name + '">' + item.title + '</div>');
				// });
			}).fail(function() {
				console.log('fail get roles');
			});
		},
		/**************************************************
		**              End Get Config
		**************************************************/
		/**************************************************
		**              Users List
		**************************************************/
		getAll: function (callback) {
			var self = this;

			// self.$usersList.empty();

			$.ajax({
				// url: "/users/usersinfo",
				url: "/users/list",
				type:"GET",
				async: true,
				headers: { 
					"Authorization": self.access_token
				},
				dataType:"json",
			}).done(function( data ) {
				console.log(data);
				self.collection = data.collection;
				window.localStorage.setItem('users', JSON.stringify(self.collection));
				main.functionsObj['users'] = users;
				callback(data);
			}).fail(function() {
				main.removeToken();
				main.initLogin();
				callback('fail');
			});

		},
		/**************************************************
		**              End Users List
		**************************************************/
		/**************************************************
		**              Users List
		**************************************************/
		getRelated: function (callback) {
			var self = this;
			// self.$usersList.empty();

			$.ajax({
				// url: "/users/usersinfo",
				url: "/users/related",
				type:"GET",
				async: true,
				headers: { 
					"Authorization": self.access_token
				},
				dataType:"json",
			}).done(function( data ) {
				console.log(data);
				self.collection = data.collection;
				window.localStorage.setItem('users', JSON.stringify(self.collection));
				main.functionsObj['users'] = users;
				callback(data);
			}).fail(function() {
				main.removeToken();
				main.initLogin();
				callback('fail');
			});

		},
		/**************************************************
		**              End Users List
		**************************************************/
		/**************************************************
		**              Bind Events
		**************************************************/
		populate: function (stringFilter) {
			var self = this;

			self.$userList.empty();
			if (self.userFilterFlag) {
				$.each(self.collection, function (i, item) {
					if (String(item[self.$userSortBy.val()]).toLowerCase().match(self.userFilterString.toLowerCase())) {
						self.generate(false ,item);
					}
				});
			} else {
				$.each(self.collection, function (i, item) {
					self.generate(false, item);
				});
			}
			self.$btnDelete = $('.btnDelete');
			self.$btnDelete.on('click', function() {
				var user_id = $(this).data('userid');
				$('.ui.basic.modal').modal('show');
				$('.ui.basic.modal .actions .ok').off('click');
				$('.ui.basic.modal .actions .ok').one('click', function(){
					self.btnDelete(user_id);
				});
			});
			self.$loader.hide();
		},
		/**************************************************
		**              End User List
		**************************************************/
		/**************************************************
		**              Bind Events
		**************************************************/
		generate: function (element, item) {
			var self = this;
			var avatarLength = item.avatar.length,
				indexAvatar = parseInt(item.avatar.length) - 1,
				indexAvatarSub,
				fileAvatar = item.avatar[indexAvatar];

			if (fileAvatar instanceof Array && typeof fileAvatar.filename === 'undefined') {
				indexAvatarSub = parseInt(fileAvatar.length) -1;
				fileAvatar = fileAvatar[indexAvatarSub];
			}

			(typeof fileAvatar !== 'undefined') ? fileAvatar = fileAvatar.file : fileAvatar = 'userImage.png';

			self.$userList
			.prepend($('<div />', { 'class': 'panel box border-color box-profile title compid_' + item._id })
				.append($('<div />', { 'class': 'box-tools pull-right' })
					.append($('<a />', { 'href': '/users/edit/' + item._id, 'class': 'btn btn-box-tool' })
						.append($('<i />', { 'class': 'fa fa-pencil'}))
					)
					.append($('<a />', { 'class': 'btn btn-box-tool btn-delete', 'data-toggle': 'modal', 'data-target': '#myModal', 'data-collection': 'users', 'data-id': item._id })
						.append($('<i />', { 'class': 'fa fa-remove'}))
					)
				)
				.append($('<a />', { 'class': 'accordion collapsed', 'data-toggle': 'collapse', 'data-parent': '#accordion', 'aria-expanded': false, 'href': '#compid_' + item._id })
					.append($('<img />', { 'class': 'profile-user-img img-responsive img-circle', 'src': '/uploads/' + fileAvatar }))
					.append($('<div />')
						.append($('<h3 />', { 'class': 'profile-username text-center capitalize', text: item.username }))
						.append($('<p />', { 'class': 'text-muted text-center', text: item.firstname + ' ' + item.lastname  }))
						.append($('<p />', { 'class': 'text-muted text-center', text: item.transportCompany }))
						.append($('<p />', { 'class': 'text-muted text-center', text: item.email }))
					)
					.append($('<hr />', { 'class': 'clear' }))
				)
				.append($('<div />', { 'class': 'panel-collapse collapse', 'id': 'compid_' + item._id, 'aria-expanded': false })
					// .append($('<div />', { 'class': 'box-body no-padding' })
					// 	.append($('<div />', { 'class': 'nav-tabs-custom' })
					// 		.append($('<ul />', { 'class': 'nav nav-tabs' })
					// 			.append($('<li />')
					// 				.append($('<a />', { 'class': 'active', 'href': '#razonSocial-' + item._id, 'data-toggle': 'tab', text: 'Razón Social' })
					// 					// .append($('<span />', { 'class': 'pull-right badge bg-blue', text: '12' }))
					// 				)
					// 			)
					// 		)
					// 		.append($('<div />', { 'class': 'tab-content' })
					// 			.append($('<div />', { 'class': 'tab-pane active', 'id': 'razonSocial-' + item._id })
					// 				.append($('<div />', { 'class': 'row cards' })
					// 					// .append($('<div />', { 'class': 'col-md-4' })
					// 					// 	.append(
					// 					// 		(typeof item !== 'undefined' && typeof item.estatuto !== 'undefined') ?
					// 					// 			$('<div />', { 'class': 'card-pf box border-color' })
					// 					// 			.append($('<h4 />', { 'class': 'box-header text-center', text: 'Estatuto Social' }))
					// 					// 				.append(
					// 					// 					(item.estatuto.length !== 0) ?
					// 					// 						$('<div />', { 'class': 'box-body' })
					// 					// 						.append(
					// 					// 							$.map(item.estatuto, function(mapEstatuto, indexEstatuto) {
					// 					// 								var fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapEstatuto.filename, text: mapEstatuto.title || mapEstatuto.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
					// 					// 								var missingFile = $('<div />', { text: 'Falta Archivo' });
					// 					// 								return (typeof mapEstatuto !== 'undefined' && typeof mapEstatuto.file !== 'undefined') ?
					// 					// 									fileuploaded
					// 					// 								:
					// 					// 									$.map(mapEstatuto, function(mapEstatutoSub, indexEstatutoSub) {
					// 					// 										fileuploaded = $('<a />', { 'class': 'btn btn-app no-margin fc-grid', 'target': '_blank', 'href': '/uploads/' + mapEstatutoSub.filename, text: mapEstatutoSub.title || mapEstatutoSub.file }).prepend($('<i />', { 'class': 'fa fa-file' }));
					// 					// 										return (typeof mapEstatutoSub !== 'undefined' && typeof mapEstatutoSub.file !== 'undefined') ?
					// 					// 											fileuploaded
					// 					// 										:
					// 					// 											missingFile
					// 					// 									})
					// 					// 							})
					// 					// 						)
					// 					// 					:
					// 					// 						''
					// 					// 				) 
					// 					// 			.append(
					// 					// 				(item.estatuto.expiration !== null) ?
					// 					// 					$('<div />', { 'class': 'box-footer text-center' })
					// 					// 					.append($('<p />')
					// 					// 						.append($('<strong />', { text: 'Vencimiento' }))
					// 					// 					)
					// 					// 					.append($('<p />')
					// 					// 						.append($('<span />', { text: item.estatuto.expiration }))
					// 					// 					)
					// 					// 				: ''
					// 					// 				)
					// 					// 			: $('<div />', { 'class': 'card-pf box border-color' })
					// 					// 			.append($('<h4 />', { 'class': 'box-header text-center', text: 'Estatuto Social' }))
					// 					// 			.append($('<div />', { 'class': 'box-footer text-center' })
					// 					// 				.append($('<div />', { 'class': 'ui primary', text: 'Falta Archivo' }))
					// 					// 			)
					// 					// 	) // End If
					// 					// )
					// 				)
					// 			)
					// 		)
					// 	)
					// )
				)
			);

		},
		/**************************************************
		**              End User List
		**************************************************/
	/**************************************************
	**				Begin Init Company
	**************************************************/
	initController: function (mode) {
		var self = this;

		// $.each(self.collection, function (i, item) {
		// 	self.generate($('.company' + mode), i, item);
		// });
		// self.populate();
		// main.overlay.hide();
	},
	/**************************************************
	**				End Init Company
	**************************************************/
		/**************************************************
		**************************************************/
		/**************************************************
		**              Bind Events
		**************************************************
		register: function (value) {
				var self = this;

				self.uploadImg($('.avatar'), 'avatar');

				var userRegArr = $('form#profileForm').serializeArray(),
						countryData = $("#phone").intlTelInput("getSelectedCountryData"),
						dialCodeVal = countryData.dialCode,
						countryVal = countryData.iso2,
						passwordReg = $('#password').val(),
						passwordRegMatch = $('#password-match').val();

						userRegArr.push({ name: 'dialCode', value: dialCodeVal});
						userRegArr.push({ name: 'locale', value: countryVal});
						userRegArr.push({ name: 'devType', value: 'Web'});

				if(passwordReg == passwordRegMatch) {
						$.ajax({
								url: '/auth/user',
								type: "POST",
								headers: { 
										"Authorization": self.access_token
								},
								data: userRegArr,
								dataType:"json"
						}).done(function(response) {
								console.log(response);
								window.location.href = "/users/";
						}).fail(function(error) {
								$('#profileForm .ui.error').toggleClass("hidden active");
								$('#profileForm .ui.error .header').text(error.responseJSON.message);
						});
				} else {
						$('#profileForm .ui.error').toggleClass("hidden active");
						$('#profileForm .ui.error .header').text('Las contraseñas no coinciden');
				}
		},
		/**************************************************
		**              End User List
		**************************************************/
		/**************************************************
		**              Bind Events
		**************************************************
		bindRegister: function (value) {
				var self = this;

				// self.$password.on('change', function() {
				//  self.validatePassword();
				// });
				// self.$passwordMatch.on('keyup', function() {
				//  self.validatePassword();
				// });
				$('.labeled.ui.dropdown').dropdown();

				$('.check').on('change', function(){
						var ischecked = '.' + $(this).attr('name');
						if ($(this).is(":checked")) {
								$(ischecked).show();
						} else {
								$(ischecked).hide();
						}
				});

				$("#phone").intlTelInput({
						initialCountry: 'AR',
						nationalMode: true,
						separateDialCode: true,
						// geoIpLookup: function(callback) {
						//  $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
						//      alert('a');
						//      var countryCode = (resp && resp.country) ? resp.country : "";
						//      callback(countryCode);
						//  });
						// },
						utilsScript: "/js/utils.js" // just for formatting/placeholders etc
				});
				// listen to "keyup", but also "change" to update when the user selects a country
				var input = $("#phone"),
				output = $("#phoneOutput")

				input.on("keyup change", function() {
						var intlNumber = input.intlTelInput("getNumber");
						if (intlNumber) {
								var error = $(this).intlTelInput("getValidationError");
						switch(error) {
								case 0: // IS_POSSIBLE
										input.css({"color": "#0b9f00"})
								break;
								case 1: // INVALID_COUNTRY_CODE
										input.css({"color": "#df1010"})
								break;
								case 2: // TOO_SHORT
										input.css({"color": "#df6e10"})
								break;
								case 3: // TOO_LONG
										input.css({"color": "#df6e10"})
								break;
								default: // NOT_A_NUMBER
										input.css({"color": "#FF0000"})
								return; // exit this handler for other keys
						}

								output.text("Internacional: " + intlNumber);
						} else {
								output.text("Ingrese su numero de Telefono");
						}
				});

				$('#submit').on('click', function () {
						self.register();
				});
		},
		/**************************************************
		**              End User List
		**************************************************/
		/**************************************************
		**              Bind Events
		**************************************************/
		bindEvents: function (value) {
				var self = this;


				self.$userSortSelect.on('change', function() {
						main.sortProperties(self.collection, self.$userSortBy.val(), self.$userSortOrder.val());
						self.populate();
				});

				self.$userFilterString.on('input', function() {
						self.userFilterString = self.$userFilterString.val();
						if (self.$userFilterString.length && self.$userFilterString.val().length) {
								self.userFilterFlag = true;
						} else {
								self.userFilterFlag = false;
						}
						self.populate();
				});

		}
		/**************************************************
		**              End Generate Refresh Token
		**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var users = new Users();