var nua = navigator.userAgent;
var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

var Global = function () {

/**************************************************
* Begin Selectors
**************************************************/
	// Body
	this.$body = document.querySelector('body');
	// Upload File
	this.$uploadFile = this.$body.querySelector('.upload-file');
		this.$uploadFileBtn = this.$uploadFile.querySelector('button');
	// Avatar
	this.$avatar = this.$body.querySelector('#avatar')

/**************************************************
* End Variables
**************************************************/

	//  Config
	this.configuration;

	//  Page
	this.mode;

	this.init();
};

Global.prototype = {
	init: function () {
		var self = this;

	},
	/**************************************************
	* Bind Events
	* @param 	{Object} 	Object 		The main Object
	* @param 	{Number} 	Number 		The index of the main Object
	* @param 	{String} 	String 		The name container of the assigned object
	* @param 	{Boolean} 	Bool 		The Object to be assigned
	**************************************************/
	selectedImage: function (input, target) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				target.src = e.target.result;
			}
			reader.readAsDataURL(input.files[0]);
		}
	}

};

var _global = new Global();
