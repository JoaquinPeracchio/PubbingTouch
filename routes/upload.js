'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const uploadFile = require('../controllers/upload');

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + '/../public/uploads'))
  },
  filename: function (req, file, cb) {
  	var fileExtension;
	console.log(file.mimetype); //Will return something like: image/jpeg
	switch(file.mimetype) {
		case 'image/jpeg':
			fileExtension = '.jpeg';
			break;
		case 'image/png':
			fileExtension = '.png';
			break;
		default:
			console.log(file.mimetype);
	}
    cb(null, Date.now() + file.originalname)
  }
})
 
var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
        console.log(file);
        var ext = path.extname(file.originalname).toLowerCase();
        if( ext !== '.png' &&
          ext !== '.jpg' &&
          ext !== '.gif' &&
          ext !== '.jpeg' &&
          ext !== '.doc'&&
          ext !== '.docx' &&
          ext !== '.pdf' &&
          ext !== '.txt' &&
          ext !== '.xls' &&
          ext !== '.xlsx') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024 * 100
    }
});

var uploadImageFile = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname).toLowerCase();
        if( ext !== '.png' &&
            ext !== '.jpg' &&
            ext !== '.jpeg') {
            return callback(new Error('Only image file is allowed'))
        }
        callback(null, true)
    }
});

var uploadKmlFile = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname).toLowerCase();
        if( ext !== '.kml') {
            return callback(new Error('Only Kml file is allowed'))
        }
        callback(null, true)
    }
});

router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/upload.html'));
});

router.post('/uploadimg', uploadImageFile.single('imgFile'), uploadFile.uploadImg);

router.post('/uploadkml', uploadKmlFile.single('kmlFile'), uploadFile.uploadKml);

router.post('/uploadfile', upload.single('myFile'), uploadFile.uploadSingle);

//Uploading multiple files
router.post('/uploadmultiple', upload.array('myFiles', 12), uploadFile.uploadMultiple);

router.get('/photos', uploadFile.getFile);

router.get('/photo/:id', uploadFile.getFilebyId);

module.exports = router;
