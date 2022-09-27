	var nua = navigator.userAgent;
	var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

	/**
	* Check Browser Notification Permission
	* @type window.Notification|Window.Notification|window.webkitNotification|Window.webkitNotification|Window.mozNotification|window.mozNotification
	*/

	var Notification = window.Notification || window.mozNotification || window.webkitNotification;
	Notification.requestPermission(function (permission) {});

	var SocketIO = function () {

	/**************************************************
					Begin Selectors
	**************************************************/

	// Body
	this.$body = $('body');
	// Loader
	this.$loader = $('#loader');
	// Initialize variables
	this.$window = $(window);
	this.$usernameInput = $('.usernameInput'); // Input for username
	this.$rooms = $('.direct-chat-room ul'); // Room area
	this.$contacts = $('.direct-chat-contacts ul'); // Room area

	this.$messages = $('.direct-chat-messages'); // Messages area
	this.$chatMessage = $('.chatMessage'); // Input message input box

	this.$loginPage = $('.login.page'); // The login page
	this.$chatPage = $('.chat.page'); // The chatroom page

	/**************************************************
					End Variables
	**************************************************/

	//  Page
	this.page;
	this.FADE_TIME = 150; // ms
	this.TYPING_TIMER_LENGTH = 2000; // ms
	this.COLORS = [
		'#e21400', '#91580f', '#f8a700', '#f78b00',
		'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
		'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
	];

	// Prompt for setting a username
	this.username;
	this.userimg;
	this.selectedRoom;
	// this.selectedRoom = 'room_' + company.collection_id[0].compid;
	this.connected = false;
	this.sessionID;
	this.typing = false;
	this.lastTypingTime;
	this.$currentInput = this.$usernameInput.focus();
	this.socketConnection = io.connect();

	this.socket = io();

	this.init();
};

SocketIO.prototype = {
	init: function () {
		var self = this;

		// self.bindEvents();
		// self.keyboardEvent();
		// self.setUsername();
	},
	/**************************************************
	**        Start bind Events
	**************************************************/
	bindEvents: function (value) {
		var self = this;

		/**
		 * Set Default Socket For Show Notification
		 * @param {type} data
		 * @returns {undefined}
		 */
		self.socket.on('show_notification', function (data) {
			alert(data);
		    self.showDesktopNotification(
				data.title,
				data.message,
				data.icon
		    );
		    main.updateLocalStorage(
				data.compid,
				data.parent,
				data.collection,
				data._id
		    );
		});

		self.socket.on('login', (data) => {
			self.connected = true;
			self.sessionID = self.socketConnection.id; //
			// Display the welcome message
			var message = "Bienvenido ";
			self.log(message, {
				prepend: true
			});
			self.addParticipantsMessage(data);
		});

		// Whenever the server emits 'new message', update the chat body
		self.socket.on('new message', (data) => {
			self.addChatMessage(data);
		});

		// Whenever the server emits 'user joined', log it in the chat body
		self.socket.on('user joined', (data) => {
			self.log(data.username.username + ' se ha conectado');
			self.addParticipantsMessage(data);
		});

		// Whenever the server emits 'user left', log it in the chat body
		self.socket.on('user left', (data) => {
			self.log(data.username.username + ' se ha desconectado');
			self.addParticipantsMessage(data);
			self.removeChatTyping(data);
		});

		// Whenever the server emits 'typing', show the typing message
		self.socket.on('typing', (data) => {
			self.addChatTyping(data);
		});

		// Whenever the server emits 'stop typing', kill the typing message
		self.socket.on('stop typing', (data) => {
			self.removeChatTyping(data);
		});

		self.socket.on('disconnect', () => {
			self.log('Ha sido desconectado');
		});

		self.socket.on('reconnect', () => {
			self.log('Se ha reconectado');
			self.connected = true;
			if (self.username) {
				self.addUser();
			}
		});

		self.socket.on('reconnect_error', () => {
			self.log('Ha fallado el intento de reconeccion');
		});

		self.$chatMessage.on('input', () => {
			self.updateTyping();
		});

		// Click events

		// Focus input when clicking anywhere on login page
		self.$loginPage.click(() => {
			self.$currentInput.focus();
		});

		// Focus input when clicking on the message input's border
		self.$chatMessage.click(() => {
			self.$chatMessage.focus();
		});

		$('.chat.title').on('click', function () {
			$('.chat.page').toggleClass('hide');
		});

	},
	/**************************************************
	**        End bind Events
	**************************************************/
	/**************************************************
		* Set Notification Request
		* @type type
	**************************************************/
	setNotification: function () {
		var self = this;

		self.showDesktopNotification('Lokesh', 'Desktop Notification..!', '/index.jpeg');
		self.sendNodeNotification('Lokesh', 'Browser Notification..!', '/index.jpeg');

	},
	/**************************************************
	**        End Set Notification Request
	**************************************************/
	/**************************************************
		* Request Browser Notification Permission 
		* @type Arguments
	**************************************************/
	requestNotificationPermissions: function () {
		var self = this;

		if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {});
		}

	},
	/**************************************************
	**        End Request Browser Notification Permission
	**************************************************/
	/**************************************************
		* Show Desktop Notification If Notification Allow
		* @param {type} title
		* @param {type} message
		* @param {type} icon
		* @returns {undefined}
	**************************************************/
	showDesktopNotification: function (message, body, icon, sound, timeout) {
		var self = this;

        if (!timeout) {
            timeout = 4000;
        }
        self.requestNotificationPermissions();
        var instance = new Notification(
                message, {
                    body: body,
                    icon: icon,
                    sound: sound
                }
        );
        instance.onclick = function () {
            // Something to do
        };
        instance.onerror = function () {
            // Something to do
        };
        instance.onshow = function () {
            // Something to do
        };
        instance.onclose = function () {
            // Something to do
        };
        if (sound)
        {
            instance.sound;
        }
        setTimeout(instance.close.bind(instance), timeout);
        return false;

	},
	/**************************************************
	**        End Show Desktop Notification If Notification Allow
	**************************************************/
	/**************************************************
     * Send Node Notification
     * @param {type} title
     * @param {type} message
     * @param {type} icon
     * @returns {undefined}
	**************************************************/
	sendNodeNotification: function (compid, title, message, icon, parent, collection, _id )  {
		var self = this;

		self.socket.emit('new_notification', {
			room: 'room_' + compid,
			title: title,
			message: message,
			icon: icon,
			compid: compid,
			parent: parent,
			collection: collection,
			_id: _id
		});
	},
	/**************************************************
	**        End Show Desktop Notification If Notification Allow
	**************************************************/
	/**************************************************
	**        Start Connected Users
	**************************************************/
	addParticipantsMessage: function (data) {
		var self = this;

		var message = '';
		if (data.numUsers === 1) {
			message += "hay 1 usuario";
		} else {
			message += "hay " + data.numUsers + " usuarios";
		}
		self.log(message);
	},
	/**************************************************
	**        Start Connected Users
	**************************************************/
	/**************************************************
	**        Start addUser
	**************************************************/
	addUser: function (data) {
		var self = this;

		// Tell the server your username
		// self.$rooms.empty();

		$.each(company.collection, function (i, item) {
			self.$rooms.append($('<li />', { text: item.titlename, 'data-room': 'room_' + item._id }))
			self.socket.emit('add user', {username: self.username, img: self.userimg, room: 'room_' + item._id}, function(response){
				console.log(response.msg);
			});
		});

		(company.collection.length <= 1) ? $('.btn-room').hide() : $('.btn-room').show();

		self.$rooms.find('li').eq(0).addClass('selected');
		self.selectedRoom = 'room_' + company.collection[0]._id;

		self.$rooms.find('li').on('click', function() {
			self.$rooms.find('li').removeClass('selected');
			self.selectedRoom = $(this).data('room');
			$(this).addClass('selected');

			self.$messages.find('li').hide();
			self.$messages.find('li.' + self.selectedRoom).show();
		});
	},
	/**************************************************
	**        Start Connected Users
	**************************************************/
	/**************************************************
	**        Start setUsername
	**************************************************/
	setUsername: function (data) {
		var self = this;

		self.userimg = self.cleanInput(main.user.avatar);
		self.username = self.cleanInput(main.user.firstname + ' ' + main.user.lastname);

		// If the username is valid
		if (self.username) {
			// self.$loginPage.fadeOut();
			self.$chatPage.show();
			self.$loginPage.off('click');
			self.$currentInput = self.$chatMessage.focus();

			// Tell the server your username
			self.addUser();
		}
	},
	/**************************************************
	**        Start setUsername
	**************************************************/
	/**************************************************
	**        Start sendMessage
	**************************************************/
	sendMessage: function (data) {
		var self = this;

		var message = self.$chatMessage.val();
		// Prevent markup from being injected into the message
		message = self.cleanInput(message);
		// if there is a non-empty message and a socket connection
		if (message && self.connected) {
			self.$chatMessage.val('');
			self.addChatMessage({
				username: {
					username: self.username,
					img: self.userimg
				},
				message: message,
				room: self.selectedRoom
			});
			// tell server to execute 'new message' and send along one parameter
			self.socket.emit('new message', {room: self.selectedRoom, msg: message});
			// self.socket.broadcast.to('room_' + company.collection._id[0].compid).emit('new message', message);
		}
	},
	/**************************************************
	**        Start sendMessage
	**************************************************/
	/**************************************************
	**        Start log
	**************************************************/
	log: function (message, options) {
		var self = this;

		var $el = $('<li>').addClass('log').text(message);
		self.addMessageElement($el, options);
	},
	/**************************************************
	**        Start log
	**************************************************/
	/**************************************************
	**        Start addChatMessage
	**************************************************/
	addChatMessage: function (data, options) {
		var self = this;

		// Don't fade the message in if there is an 'X was typing'
		var $typingMessages = self.getTypingMessages(data);
		options = options || {};
		if ($typingMessages.length !== 0) {
			options.fade = false;
			$typingMessages.remove();
		}
		if (data.room != self.selectedRoom) {
			options.hide = true;
		}

		var $usernameImg = $('<img src="' + data.username.img + '" class="userimg"/>');
		var $usernameDiv = $('<span class="username"/>')
			.text(data.username.username)
			.css('color', self.getUsernameColor(data.username.username));
		var $messageBodyDiv = $('<span class="messageBody">')
			.text(data.message);

		var typingClass = data.typing ? 'typing' : '';
			if (self.username == data.username.username) {
				var $messageDiv = $('<li class="direct-chat-msg right ' + data.room + '"/>')
			} else {
				var $messageDiv = $('<li class="direct-chat-msg ' + data.room + ' ' + typingClass + '" data-username="' + data.username.username + '"/>')
			}
			$messageDiv.append($('<div />', { 'class': 'direct-chat-info clearfix' })
				.append($('<span />', { 'class': 'direct-chat-name pull-left capitalize', text: data.username.username }))
				.append($('<span />', { 'class': 'direct-chat-timestamp pull-right', text: '23 Jan 5:37 pm' }))
			)
			.append($('<img />', { 'class': 'direct-chat-img', 'src': data.username.img }))
			.append($('<div />', { 'class': 'direct-chat-text', text: data.message }))

		if (self.username == data.username.username) {
			$messageDiv.addClass('right');
		}
		// var $messageDiv = $('<li class="message ' + data.room + '"/>')
		// 	.data('username', data.username.username)
		// 	.addClass(typingClass)
		// 	.append($usernameImg, $usernameDiv, $messageBodyDiv);

		// self.addMessageElement($messageDiv, options);
		self.addMessageElement($messageDiv, options);
	},
	/**************************************************
	**        Start addChatMessage
	**************************************************/
	/**************************************************
	**        Start addChatTyping
	**************************************************/
	addChatTyping: function (data) {
		var self = this;

		data.typing = true;
		data.message = 'esta escribiendo';
		self.addChatMessage(data);
	},
	/**************************************************
	**        Start addChatTyping
	**************************************************/
	/**************************************************
	**        Start removeChatTyping
	**************************************************/
	removeChatTyping: function (data) {
		var self = this;

		self.getTypingMessages(data).fadeOut(function () {
			$(this).remove();
		});
	},
	/**************************************************
	**        Start removeChatTyping
	**************************************************/
	/**************************************************
	**        Start addMessageElement
	**************************************************/
	addMessageElement: function (el, options) {
		var self = this;

		var $el = $(el);

		// Setup default options
		if (!options) {
			options = {};
		}
		if (typeof options.fade === 'undefined') {
			options.fade = true;
		}
		if (typeof options.hide === 'undefined') {
			options.hide = false;
		}
		if (typeof options.right === 'undefined') {
			options.right = false;
		}
		if (typeof options.prepend === 'undefined') {
			options.prepend = false;
		}

		// Apply options
		if (options.fade) {
			$el.hide().fadeIn(self.FADE_TIME);
		}
		if (options.hide) {
			$el.hide();
		}
		if (options.prepend) {
			self.$messages.prepend($el);
		} else {
			self.$messages.append($el);
		}
		self.$messages[0].scrollTop = self.$messages[0].scrollHeight;
	},
	/**************************************************
	**        Start addMessageElement
	**************************************************/
	/**************************************************
	**        Start cleanInput
	**************************************************/
	cleanInput: function (input) {
		var self = this;

		return $('<div/>').text(input).html();
	},
	/**************************************************
	**        Start cleanInput
	**************************************************/
	/**************************************************
	**        Start updateTyping
	**************************************************/
	updateTyping: function () {
		var self = this;

	// Updates the typing event
		if (self.connected) {
			if (!self.typing) {
				self.typing = true;
				self.socket.emit('typing', {room: self.selectedRoom});
			}
			self.lastTypingTime = (new Date()).getTime();

			setTimeout(() => {
				var typingTimer = (new Date()).getTime();
				var timeDiff = typingTimer - self.lastTypingTime;
				if (timeDiff >= self.TYPING_TIMER_LENGTH && self.typing) {
					self.socket.emit('stop typing', {room: self.selectedRoom});
					self.typing = false;
				}
			}, self.TYPING_TIMER_LENGTH);
		}
	},
	/**************************************************
	**        Start updateTyping
	**************************************************/
	/**************************************************
	**        Start getTypingMessages
	**************************************************/
	getTypingMessages: function (data) {
		var self = this;

	// Gets the 'X is typing' messages of a user
		return $('.typing.direct-chat-msg').filter(function (i) {
			return $(this).data('username') === data.username.username;
		});
	},
	/**************************************************
	**        Start getTypingMessages
	**************************************************/
	/**************************************************
	**        Start getUsernameColor
	**************************************************/
	getUsernameColor: function (username) {
		var self = this;

	// Gets the color of a username through our hash function
		// Compute hash code
		var hash = 7;
		for (var i = 0; i < username.length; i++) {
			 hash = username.charCodeAt(i) + (hash << 5) - hash;
		}
		// Calculate color
		var index = Math.abs(hash % self.COLORS.length);
		return self.COLORS[index];
	},
	/**************************************************
	**        Start getUsernameColor
	**************************************************/
	/**************************************************
	**        Start getUsernameColor
	**************************************************/
	keyboardEvent: function (username) {
		var self = this;

	// Keyboard events

		self.$window.keydown(event => {
			// Auto-focus the current input when a key is typed
			if (!(event.ctrlKey || event.metaKey || event.altKey)) {
				self.$currentInput.focus();
			}
			// When the client hits ENTER on their keyboard
			if (event.which === 13) {
				if (self.username) {
					self.sendMessage();
					self.socket.emit('stop typing', {room: self.selectedRoom});
					self.typing = false;
				} else {
					// self.setUsername();
				}
			}
		});
	}
	/**************************************************
	**        Start getUsernameColor
	**************************************************/

};

// document.addEventListener("deviceready", onDeviceReady, false);

var socketio = new SocketIO();
