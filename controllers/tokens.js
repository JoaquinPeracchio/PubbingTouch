'use strict';

let mongoose = require('mongoose');
let config = require('../config/env');
let logger = require('../helpers/logger');
let Token = mongoose.model('Token');
var generateJwtToken = require('../helpers/auth').generateJwtToken;
let _ = require('lodash');

/**
 * Lista tokens con posibilidad de:
 * - ordenar
 * - filtrar
 * @return {json} 
 */
const getTokensList = (req, res, next) => {
  let user = req.user;
  Token.find({ user_id: user.sub }).lean().exec(function(err, data) {  // jshint ignore:line
    if(err) {
      logger.error('Error', { msg:err });
      return next(err);
    }
    return res.json({ tokens: data });
  });
};

/**
 * Listar los refresh_tokens de un usuario
 * en particular dado su UID (_id)
 * Solo para administradores
 */
const getUserTokensList = (req, res, next) => {
  let userid = req.params.userid;
  Token.find({ user_id: userid }).lean().exec(function(err, data) {  // jshint ignore:line
    if(err) {
      logger.error('Error', { msg:err });
      return next(err);
    }
    return res.json({ 
      userid: userid,
      tokens: data 
    });
  });
};

/**
 * Revocar un refresh_token
 * El usuario debe pasar un access_token válido
 */
const revokeToken = (req, res, next) => {
  let user = req.user;
  let err;
  // Me fijo si el usuario tiene permisos para revocar un token
  if(_.indexOf(user.scope.actions, 'revoke_token') < 0) {
    logger.error('Error 401', { user:user });
    err = new Error();
    err.status = 401;
    return next(err);
  }

  var body = req.body;
  var tokenId = req.body.tokenId;
  var userId = user.sub;

  if(!userId || !tokenId) {
    logger.error('Error 401', { userId:userId, tokenId:tokenId });
    err = new Error();
    err.status = 401;
    return next(err);
  }

  Token.findOneAndRemove({ user_id:userId, tokenId:tokenId }, function(err, removedElement) {  // jshint ignore:line
    // removedElement es el doc eliminado si se encuentra o null
    if(err) {
      logger.error('Error', { msg:err });
      return next(err);
    }
    if(removedElement) {
      return res.json({ 
        'code': 200,
        'status': 'success',
        'revoked_token': tokenId
      });
    }
    return res.json({ 
      'code': 503,
      'status':'Error',
      'message': 'Token could not be revoked. Please try again later'
    });
  });
};

/**
 * Generar un access_token a partir de un
 * refresh_token pasado por el usuario
 * Solo para usuarios moviles
 */
const generateAccessToken = (req, res, next) => {
  let tokenId = req.body.tokenId;    
  console.log('token');

  if(!tokenId || (tokenId && tokenId.length !== 32)) {
    logger.error('Error 401', { tokenId:tokenId });
    var err = new Error();
        err.status = 401;
    return next(err);
  }

  Token.findOne({ tokenId: tokenId })
    .populate({ path:'user_id' })
    .lean()
    .exec(function(err, data) {  // data = tokens
      if(err) {
        logger.error('Error', { msg:err });
        return next(err);
      }
      
      if(data) {
        generateJwtToken(data.user_id, null, null, true, function(error, token) {  // jshint ignore:line
          if(error) {
            logger.error('Error generating user token. ', {
              user: 'user', 
              expTime: 'exp', 
              detail: error 
            });
            return res.json({
              'code': 500,
              'status': 'error',
              'message': 'Error generating access_token. Please try again later'
            });
          }
          let response = {
            'code': 200,
            'status': 'success',
            'access_token': token.access_token || null  // jshint ignore:line
          };
          return res.json(response); // Listo, devuelvo al usuario
        });
      } else {
        let response = {
          'code': 404,
          'status': 'error',
          'message': 'Error null source'  // jshint ignore:line
        };
        return res.status(404).json(response);
      }
    });     
};

module.exports = {
  getTokensList,
  revokeToken,
  generateAccessToken,
  getUserTokensList
};
