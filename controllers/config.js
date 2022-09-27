'use strict';

const mongoose = require('mongoose');
const Configuration = mongoose.model('Configuration');
const jwt      = require('jsonwebtoken');
const logger = require('../helpers/logger');

var configController = {};

configController.edit = (req, res) =>  {
  Configuration.findOne({_id: req.params.id}).exec(function (err, configuration) {
    if (err) { console.log("Error:", err); return; }
    
    console.log('####################$##############');
    console.log(configuration);
    res.render("../views/configuration/edit", {collection: configuration});
    
  });
};
 
configController.update = (req, res) => {

  var handler = [];
 console.log('$$$$$$$$$$$$$$$$$$$$$$')       ;
  console.log(req.body);
 console.log('$$$$$$$$$$$$$$$$$$$$$$')       ;
  if (typeof req.body.table_handler !== 'undefined') {
    if (req.body.table_handler instanceof Array) {
      console.log('true');
      for (var i = 0; i < req.body.table_handler.length; i++) {
        handler.push(req.body.table_handler[i]);
      }
    } else {
        console.log('false');
        handler.push(req.body.table_handler);
    }
  }
  console.log(handler);

    Configuration.findByIdAndUpdate( req.params.id, {$set: {
        tarifaname: req.body.tarifaname,
        number: req.body.number,
        parent: req.body.parent,
        subsidios : {
          gasoil: req.body.gasoil,
          sistau: req.body.sistau,
          rcc: req.body.rcc,
          ccp: req.body.ccp,
          amba: req.body.amba,
      },
        documentos : {
          autorizacion : {
        filename: req.body.filename,
        file: req.body.file,
        expiration: req.body.expiration
      },
          renovacion : {
        filename: req.body.filename,
        file: req.body.file,
        expiration: req.body.expiration
      }
        }
     }}, { new: true },
    function( err, configuration){
        if( err ){ 
            console.log('Error: ', err); 
            res.render('../views/config/edit', {collection: req.body} );
        }
 console.log('$$$$$$$$$$$$$$$$$$$$$$')       ;
        console.log( configuration );
        
        res.redirect('/config');
        
    });
};
  
configController.register = (req, res, next) => {

  const body = req.body;

  let configuration = new Configuration();
      configuration.createAt = Date.now();
//      configuration.user_id = req.user.sub;  // jshint ignore:line

  if(body.role) configuration.role = body.role; // zapping, poweron, ...
  if(body.role) configuration.role = body.role; // zapping, poweron, ...

  configuration.save(function(err, configuration) {
    if(err) {
      logger.error('Error saving configuration record ', { msg:err });
      return next(err);
    } else {
      logger.debug('New configuration record', { tag:'newConfiguration' });
      return res.json({ status:'success' });
    }
  });

  // var administrator = {};
  // console.log(body.administrator_id);
  // if (typeof body.administrator_id !== 'undefined') {
  //   if (body.administrator_id instanceof Array) {
  //     console.log('true');
  //     for (var i = 0; i < body.administrator_id.length; i++) {
  //       configuration.administrator.push({
  //         _id: body.administrator_id[i],
  //         name: body.administrator_name[i],
  //         position: body.administrator_position[i]
  //       });
  //     }
  //   } else {
  //       console.log('false');
  //       configuration.administrator.push({
  //         _id: body.administrator_id,
  //         name: body.administrator_name,
  //         position: body.administrator_position
  //       });
  //   }
  // }

//commented
  configuration.save(function(err, configuration) {
    if(err) {
      logger.error('Error saving configuration record ', { msg:err });
      return next(err);
    } else {
      logger.debug('New configuration record', { tag:'newConfiguration' });
      return res.json({
        status:'success',
        tarifa_id: configuration._id
      });
    }
  });

  // Super fast insert and response!! 
  // Configuration.collection.insertOne(configuration);
  // var response = {
  //   'status':'success'
  // }
  // return res.json(response);
};


// Get all configuration
configController.getConfiguration = (req, res, next) => {
  // req.user ==> jwt payload
  TarifaType
    .find()
    .lean()
    .limit(100)
    .exec(function(err, data) {
    if(err) {
      logger.error('Errora', { msg:err });
      return next(err);
    }
    return res.json({ collection: data });
  });
};

// Get all configuration
configController.getList = (req, res, next) => {
  // req.user ==> jwt payload
  Configuration
    .find()
    .lean()
    .limit(100)
    .exec(function(err, data) {
    if(err) {
      logger.error('Errora', { msg:err });
      return next(err);
    }
    return res.json({ collection: data });
  });
};

configController.getRelated = function(req, res) { 
  console.log('getconfiguration');
  const payload = jwt.decode(req.headers.authorization);
  console.log('payload');
  let response = {};
  console.log(payload.sub);

Configuration.find({configuration_admin : {$elemMatch : { userAdmin : payload.sub }}}, (err, data) => {
      res.status(200).json({ collection: data });
});
  // Configuration.find({
  //   configuration_admin : {
  //     $in : [payload.sub]
  //   }
  // }, (err, configuration) => {
  //     if(err) res.status(400).json({ response: 'Se produjo un error en la solicitud' });

  //     if(!configuration) res.status(404).json({ response: 'No se encontro el usuario' });

  //     let response = {};
  //     response    = configuration.user_id;
  //     console.log(response);
  //     res.status(200).json(response);

  //   });

//   Configuration.findOne({ configuration_admin.user_id: payload.sub }, (err, configuration) => {
//       if(err) res.status(400).json({ response: 'Se produjo un error en la solicitud' });

//       if(!configuration) res.status(404).json({ response: 'No se encontro el usuario' });

//       const date = configuration.premiumExpirationDate ? new Date(configuration.premiumExpirationDate) : new Date(0);
//       const dNow = new Date();

//       let response = {};
//       response.firstname    = configuration.firstname;
//       response.lastname    = configuration.lastname;
//       response.configurationname    = configuration.configurationname;
//       response.avatar    = configuration.avatar;
//       response.email     = configuration.email;
//       console.log(response);
//       res.status(200).json(response);

//     });
};

// delete Configuration
configController.deleteItem = function(req, res, next) {
  return Configuration.findById(req.params.id, function(err, Configuration) {
    if(!Configuration) {
      var error = new Error('Configuration not found');
          error.status = 404;
      return next(err);
    }
    return Configuration.remove(function(err) {
      if(err) {
        logger.error('Internal error', { err:err });
        return next(err);
      }
      else {
        var deletedConfiguration = {
          status: 'success',
          Configurationid: req.params.id
        };
        return res.json(deletedConfiguration);
      }
    });
  });
};

// Get all configuration populated (with users info)
configController.getPopulated = (req, res, next) => {
  Configuration
    .find()
    .populate({path:'user_id', select:'email gender locale ageMin ageMax timezone'})
    .lean()
    .limit(100)
    .exec(function(err, data) {
    if(err) {
      logger.error('Error1', { msg:err });
      return next(err);
    }
    return res.json({ collection:data });
  });
};

module.exports = configController;