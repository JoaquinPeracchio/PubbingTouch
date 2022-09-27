'use strict';

const mongoose  = require('mongoose');
const Upload = mongoose.model('Upload');
const logger    = require('../helpers/logger');

// Get all activity
const uploadImg = (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  let uploadedfile = new Upload();
      uploadedfile.createAt = Date.now();
      uploadedfile.user_id = 'req.user.sub';  // jshint ignore:line
      uploadedfile.filename = file.filename;  // jshint ignore:line
      uploadedfile.path = file.path;  // jshint ignore:line
      uploadedfile.destination = file.destination;  // jshint ignore:line
      uploadedfile._id = file._id;  // jshint ignore:line
      // uploadedfile.buffer = file.buffer.toString('base64');  // jshint ignore:line

  uploadedfile.save(function(err, uploadedfile) {
    if(err) {
      logger.error('Error saving file record ', { msg:err });
      return next(err);
    } else {
      logger.debug('New file upload record', { tag:'newFile' });
      // return res.json({ status:'success' });
      // res.send(file);
      file.fileId = uploadedfile._id;
      return res.json({ file });
    }
  });
};

// Get all activity
const uploadKml = (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  let uploadedfile = new Upload();
      uploadedfile.createAt = Date.now();
      uploadedfile.user_id = 'req.user.sub';  // jshint ignore:line
      uploadedfile.filename = file.filename;  // jshint ignore:line
      uploadedfile.path = file.path;  // jshint ignore:line
      uploadedfile.destination = file.destination;  // jshint ignore:line
      uploadedfile._id = file._id;  // jshint ignore:line
      // uploadedfile.buffer = file.buffer.toString('base64');  // jshint ignore:line

  uploadedfile.save(function(err, uploadedfile) {
    if(err) {
      logger.error('Error saving file record ', { msg:err });
      return next(err);
    } else {
      logger.debug('New file upload record', { tag:'newFile' });
      // return res.json({ status:'success' });
      // res.send(file);
      file.fileId = uploadedfile._id;
      return res.json({ file });
    }
  });
};

// Get all activity
const uploadSingle = (req, res, next) => {
  const file = req.file
  console.log(file);
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }


  let uploadedfile = new Upload();
      uploadedfile.createAt = Date.now();
      uploadedfile.user_id = 'req.user.sub';  // jshint ignore:line
      uploadedfile.filename = file.filename;  // jshint ignore:line
      uploadedfile.path = file.path;  // jshint ignore:line
      uploadedfile.destination = file.destination;  // jshint ignore:line
      uploadedfile._id = file._id;  // jshint ignore:line
      // uploadedfile.buffer = file.buffer.toString('base64');  // jshint ignore:line

  uploadedfile.save(function(err, uploadedfile) {
    if(err) {
      logger.error('Error saving file record ', { msg:err });
      return next(err);
    } else {
      logger.debug('New file upload record', { tag:'newFile' });
      // return res.json({ status:'success' });
      // res.send(file);
      file._id = uploadedfile._id;
      return res.json({ file });
    }
  });
};

const uploadMultiple = (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  files.forEach(element => {
    let uploadedfile = new Upload();
        uploadedfile.createAt = Date.now();
        uploadedfile.user_id = 'req.user.sub';  // jshint ignore:line
        uploadedfile.filename = element.filename;  // jshint ignore:line
        uploadedfile.path = element.path;  // jshint ignore:line
        uploadedfile.destination = element.destination;  // jshint ignore:line
        uploadedfile._id = element._id;  // jshint ignore:line
        // uploadedfile.buffer = element.buffer.toString('base64');  // jshint ignore:line

    uploadedfile.save(function(err, uploadedfile) {
      if(err) {
        logger.error('Error saving file record ', { msg:err });
        return next(err);
      } else {
        logger.debug('New file upload record', { tag:'newFile' });
      }
    });
    return res.json({ uploadedfile });
  });
  // return res.json({ status:'success' });
  // res.send(files)
};

const getFile = (req, res) => {
  Upload
    .find()
    .lean()
    .limit(100)
    .exec(function(err, data) {
    if(err) {
      logger.error('Error', { msg:err });
      return next(err);
    }
    return res.json({ uploadedFiles:data });
  });
  // Upload.find().toArray((err, result) => {
  //   const imgArray= result.map(element => element._id);
  //   console.log(imgArray); 
  //   if (err) return console.log(err)
  //   res.send(imgArray)
  // })
};

const getFilebyId = (req, res) => {
  console.log('asd');
  var userId = req.params.id;
  Upload.findById(userId, function(err, result) {
    if (err) return console.log(err)
    // res.contentType('image/jpeg');
    // let buff = new Buffer(result.buffer, 'base64');  
    // fs.writeFileSync('stack-abuse-logo-out.png', buff);
    res.send(result)
  })
};

module.exports = {
  uploadImg,
  uploadKml,
  uploadSingle,
  uploadMultiple,
  getFile,
  getFilebyId
};
