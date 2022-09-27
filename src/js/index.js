var nua = navigator.userAgent;
var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

var User = function () {

/**************************************************
* Begin Selectors
**************************************************/
	// Body
	this.$body = document.querySelector('body');
	// Upload File
	this.$uploadFile = this.$body.querySelector('.upload-file');
		this.$uploadFileBtn = this.$uploadFile.querySelector('button');
		this.$uploadFileInput = this.$uploadFile.querySelector('#avatar');
	// Avatar
	this.$photo = this.$body.querySelector('.photo');
	this.$avatar = this.$body.querySelector('.photo__img');
	// User Nav
	this.$userNav = this.$body.querySelector('.user-nav');
		this.$userNavItem = this.$userNav.querySelectorAll('.user-nav__list');
			this.$userNavItemLink = this.$userNav.querySelectorAll('.user-nav .user-nav__link');
	// User Nav Content
	this.$userNavContent = this.$body.querySelectorAll('.user-nav-content');

	// User Nav Content
	this.$userEdit = this.$body.querySelector('.user-edit');
		this.$userEditItem = this.$body.querySelectorAll('.user-edit__item');
	// Swipeable
	this.$swipeableEl = this.$body.querySelector('.user-content');
		this.$swipeable = this.$body.querySelector('.user-nav-content');

/**************************************************
* End Variables
**************************************************/

	//  target
	this.targetElement;

	//  Page
	this.mode;
	this.$preventTouch = false;
	this.touchstart;
	this.touchend;
	this.mouseStart;
	this.mouseStartY;
	this.mouseEnd;
	this.mouseEndY;
	this.xMove = 0;
	this.yMove = 0;
	this.itemPos = 0;
	this.endTransition = 'transitionend';
	// this.endTransition = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
	this.matchTransform = /matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/;

	this.init();
};

User.prototype = {
	init: function () {
		var self = this;

		self.bindEvents();
		self.swipeContent();
	},
	/**************************************************
	* Bind Events
	* @param 	{Object} 	Object 		The main Object
	* @param 	{Number} 	Number 		The index of the main Object
	* @param 	{String} 	String 		The name container of the assigned object
	* @param 	{Boolean} 	Bool 		The Object to be assigned
	**************************************************/
	bindEvents: function (val) {
		var self = this;

		self.$uploadFileBtn.addEventListener('click', function() { 
			console.log('click');
			self.$uploadFileInput.click();
		});
		self.$photo.addEventListener('click', function() { 
			console.log('click');
			self.$uploadFileInput.click();
		});
		self.$uploadFileInput.addEventListener('change', function() { 
			console.log('changed');
			_global.selectedImage(self.$uploadFileInput, self.$avatar);
			self.$avatar.classList.add('photo--changed');
		});
		for (let i = 0; i < self.$userNavItem.length; i++) {
			self.$userNavItem[i].addEventListener('click', function() {
				self.$userNavItem.forEach( e => {
					e.classList.remove('user-nav--active');
				});
				self.$userNavItem[i].classList.add('user-nav--active');
				self.$userNavContent.forEach( e => {
					e.classList.remove('user-nav-content--active');
				});
				document.querySelector(self.$userNavItem[i].children[0].hash).classList.add('user-nav-content--active');
			});
		}
		for (let i = 0; i < self.$userEditItem.length; i++) {
			self.$userEditItem[i].querySelector('.user-edit__btn').addEventListener('click', function(e) {
				self.$userEditItem.forEach( e => {
					e.classList.remove('user-edit__tooltip--active');
				});
				let selectedItem = self.$userEditItem[i];
				let selectedValue = selectedItem.querySelector('.user-edit__value');
				let selectedLabel = selectedItem.querySelector('.tooltip__title');
				let selectedInput = selectedItem.querySelector('.tooltip__input');
				let saveBtn = selectedItem.querySelector('.tooltip__btn--blue');
				let cancelBtn = selectedItem.querySelector('.tooltip__btn--blue-inverted');

				let hasText = (element) => {
					( element.value.length > 0) ? selectedLabel.classList.add('tooltip__title--filled') : selectedLabel.classList.remove('tooltip__title--filled');
				}

				selectedInput.value = selectedValue.textContent;
				hasText(selectedInput);
				selectedItem.classList.add('user-edit__tooltip--active');

				document.addEventListener('click', function(e) {
					let clickedInside = selectedItem.contains(e.target);
					let clickedCancel = cancelBtn.contains(e.target);
					let clickedSave = saveBtn.contains(e.target);
					if (!clickedInside || clickedCancel|| clickedSave) {
						selectedItem.classList.remove('user-edit__tooltip--active');
						document.removeEventListener(e.type, arguments.callee);
					}
				});

				selectedInput.addEventListener('focus', function() {
					selectedLabel.classList.add('tooltip__title--focused');
				});
				selectedInput.addEventListener('focusout', function() {
					selectedLabel.classList.remove('tooltip__title--focused');
				});
				selectedInput.addEventListener('change', function() {
					hasText(this);
				});
				saveBtn.addEventListener('click', function() {
					selectedValue.textContent = selectedInput.value;
				});
			});
		}
	},
	/**************************************************
	* Touch Events
	* @param 	{Object} 	Object 		The main Object
	* @param 	{Number} 	Number 		The index of the main Object
	* @param 	{String} 	String 		The name container of the assigned object
	* @param 	{Boolean} 	Bool 		The Object to be assigned
	**************************************************/
	swipeContent: function (val) {
		var self = this;

		let activeNav = (orientation) => {
			if (orientation == 'next') {
				self.itemPos = parseInt(self.itemPos + 1);
			} else {
				self.itemPos = parseInt(self.itemPos - 1);
			}
			self.$userNavItem.forEach( e => {
				e.classList.remove('user-nav--active');
			});
			self.$userNavItem[self.itemPos].classList.add('user-nav--active');
			console.log(self.itemPos);
		}

		let animateTo = (pixels) => {
			var sign = Math.sign((self.xMove) + (pixels));
			var movement = parseInt(self.xMove + pixels);
			self.$swipeableEl.classList.add('animate');
			self.$swipeableEl.style.WebkitTransformOrigin = "translate3d(" + movement + "px, 0, 0)"
			self.$swipeableEl.style.webkitTransform = "translate3d(" + movement + "px, 0, 0)"
			self.$swipeableEl.addEventListener(self.endTransition, function endTransitionEvt(e){
				self.$swipeableEl.classList.remove('animate');
				console.log('$(this).off(self.endTransition)');
				self.xMove = parseInt(self.$swipeableEl.style.webkitTransform.split('(')[1].split(',')[0]);   // Set last position of the elements
				e.currentTarget.removeEventListener(e.type, endTransitionEvt);
			});
		}

		if(self.$swipeable.className != 'animate'){
			this.$swipeableEl.addEventListener('touchstart',function(e){
				(self.$swipeable.className != 'animate') ? self.$preventTouch = true : self.$preventTouch = false;
				self.touchstart = new Date().getTime();
				if (self.$preventTouch) {
					var touch = e.touches[0] || e.changedTouches[0];

					e.preventDefault();
					self.mouseStart = touch.pageX;
					self.mouseStartY = touch.pageY;
				}
			});
			this.$swipeableEl.addEventListener('touchmove',function(e){
				if (self.$preventTouch) {
					var touch = e.touches[0] || e.changedTouches[0];

					e.preventDefault();
					var dist = Math.round(self.xMove + touch.pageX - self.mouseStart);
					var distY = Math.round(self.xMove + touch.pageY - self.mouseStartY);

					self.$swipeableEl.style.WebkitTransformOrigin = "translate3d(" + dist + "px, 0, 0)"
					self.$swipeableEl.style.webkitTransform = "translate3d(" + dist + "px, 0, 0)"
				}
			});
			this.$swipeableEl.addEventListener('touchend',function(e){
				if (self.$preventTouch) {
					var touch = e.touches[0] || e.changedTouches[0];

					self.mouseEnd = touch.pageX;
					self.mouseEndY = touch.pageY;
					var dist = Math.round(self.mouseEnd - self.mouseStart);
					var distY = Math.round(self.mouseEndY - self.mouseStartY);

					e.preventDefault();
					e.stopPropagation();

					self.touchend = new Date().getTime();
					// If the touch movement is equal than 0 pixels make go to the element url
					if (Math.abs(self.touchend - new Date().getTime()) <= 500 && Math.abs(dist) < 50 && Math.abs(distY) < 50) {
					} else if (Math.abs(dist) > Math.abs(distY)) {
						// (dist > 0 || dist < -(self.$swipeable.clientWidth * (self.$swipeableEl.childElementCount -1))) ? console.log('true') : console.log('false');
						var translated = parseInt(self.$swipeableEl.style.webkitTransform.split('(')[1].split(',')[0]);
						if (translated > 0 || translated < -(self.$swipeable.clientWidth * (self.$swipeableEl.childElementCount - 1))) {
							console.log('animateTo');
							animateTo(0);
						} else {
							if ( dist > 100 ) {
								animateTo(parseInt(self.$swipeable.clientWidth));
								activeNav('prev');
							} else if ( dist < -100 ) {
								animateTo(parseInt('-' + self.$swipeable.clientWidth));
								activeNav('next');
							} else {
								console.log('animateTo');
								animateTo(0);
							}
						}
					}
					// self.xMove = 0;
					// self.xMove = parseInt(self.$swipeableEl.style.webkitTransform.split('(')[1].split(',')[0]);   // Set last position of the elements
					self.$preventTouch = false;
				}
			});
		}
		window.addEventListener("orientationchange", function() {
			var newWidth = parseInt(self.$swipeable.clientWidth * self.itemPos);
			self.$swipeableEl.style.WebkitTransformOrigin = "translate3d(" + newWidth + "px, 0, 0)"
			self.$swipeableEl.style.webkitTransform = "translate3d(" + newWidth + "px, 0, 0)"
		});
	}

};

var user = new User();
