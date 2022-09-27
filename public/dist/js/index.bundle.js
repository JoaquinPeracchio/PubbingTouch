/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var nua = navigator.userAgent;\nvar is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));\n\nvar User = function () {\n\n/**************************************************\n* Begin Selectors\n**************************************************/\n\t// Body\n\tthis.$body = document.querySelector('body');\n\t// Upload File\n\tthis.$uploadFile = this.$body.querySelector('.upload-file');\n\t\tthis.$uploadFileBtn = this.$uploadFile.querySelector('button');\n\t\tthis.$uploadFileInput = this.$uploadFile.querySelector('#avatar');\n\t// Avatar\n\tthis.$avatar = this.$body.querySelector('.photo__img');\n\t// User Nav\n\tthis.$userNav = this.$body.querySelector('.user-nav');\n\t\tthis.$userNavItem = this.$userNav.querySelectorAll('.user-nav__list');\n\t\t\tthis.$userNavItemLink = this.$userNav.querySelectorAll('.user-nav .user-nav__link');\n\t// User Nav Content\n\tthis.$userNavContent = this.$body.querySelectorAll('.user-nav-content');\n\n\t// User Nav Content\n\tthis.$userEdit = this.$body.querySelector('.user-edit');\n\t\tthis.$userEditItem = this.$body.querySelectorAll('.user-edit__item');\n\n/**************************************************\n* End Variables\n**************************************************/\n\n\t//  Config\n\tthis.configuration;\n\n\t//  Page\n\tthis.mode;\n\n\tthis.init();\n};\n\nUser.prototype = {\n\tinit: function () {\n\t\tvar self = this;\n\n\t\tself.bindEvents('asd');\n\t},\n\t/**************************************************\n\t* Bind Events\n\t* @param \t{Object} \tObject \t\tThe main Object\n\t* @param \t{Number} \tNumber \t\tThe index of the main Object\n\t* @param \t{String} \tString \t\tThe name container of the assigned object\n\t* @param \t{Boolean} \tBool \t\tThe Object to be assigned\n\t**************************************************/\n\tbindEvents: function (val) {\n\t\tvar self = this;\n\n\t\tself.$uploadFileBtn.addEventListener('click', function() { \n\t\t\tconsole.log('click');\n\t\t\tself.$uploadFileInput.click();\n\t\t});\n\t\tself.$uploadFileInput.addEventListener('change', function() { \n\t\t\tconsole.log('changed');\n\t\t\t_global.selectedImage(self.$uploadFileInput, self.$avatar);\n\t\t\tself.$avatar.classList.add('photo--changed');\n\t\t});\n\t\tfor (let i = 0; i < self.$userNavItem.length; i++) {\n\t\t\tself.$userNavItem[i].addEventListener('click', function() {\n\t\t\t\tself.$userNavItem.forEach( e => {\n\t\t\t\t\te.classList.remove('user-nav--active');\n\t\t\t\t});\n\t\t\t\tself.$userNavItem[i].classList.add('user-nav--active');\n\t\t\t\tself.$userNavContent.forEach( e => {\n\t\t\t\t\te.classList.remove('user-nav-content--active');\n\t\t\t\t});\n\t\t\t\tdocument.querySelector(self.$userNavItem[i].children[0].hash).classList.add('user-nav-content--active');\n\t\t\t});\n\t\t}\n\t\tfor (let i = 0; i < self.$userEditItem.length; i++) {\n\t\t\tself.$userEditItem[i].addEventListener('click', function() {\n\t\t\t\tself.$userEditItem.forEach( e => {\n\t\t\t\t\te.classList.remove('user-edit__tooltip--active');\n\t\t\t\t});\n\t\t\t\tself.$userEditItem[i].classList.add('user-edit__tooltip--active');\n\t\t\t\tself.$userEditItem[i].querySelector('.tooltip__input').addEventListener('focus', function() {\n\t\t\t\t\t// if (document.activeElement.className === 'tooltip__input') {\n\t\t\t\t\t\tself.$userEditItem[i].querySelector('.tooltip__title').classList.add('tooltip__title--focused');\n\t\t\t\t\t// }\n\t\t\t\t});\n\t\t\t\t// self.$userEditItem[i].querySelector('.tooltip__btn--blue-inverted').addEventListener('click', function() {\n\t\t\t\t// \tself.$userEditItem[i].classList.remove('user-edit__tooltip--active');\n\t\t\t\t// });\n\t\t\t});\n\t\t}\n\t}\n\n};\n\nvar user = new User();\n\n//# sourceURL=webpack:///./src/js/index.js?");

/***/ })

/******/ });