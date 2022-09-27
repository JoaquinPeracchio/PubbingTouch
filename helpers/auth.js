'use strict';

let config = require('../config/env');
let jwt = require('jsonwebtoken');
let uuid = require('uuid');
var logger = require('./logger');
var mongoose = require('mongoose');
var Token = mongoose.model('Token');

/**
 * Guardar un refresh token
 */
const _saveRefreshToken = (token) => {
  var tok = new Token();
      tok.createdAt = token.createdAt;
      tok.tokenId = token.tokenId;
      tok.deviceType = token.device.type;
      tok.deviceName = token.device.name;  // Mobile siempre tiene esta propiedad
      tok.user_id = token.userId;  // jshint ignore:line

  tok.save(function(err, tok) {
    if(err) {
      return logger.error('Error saving new token ', { err:err });
    } 
  });
};

/**
 * Function to generate jwt
 * Se usa para generar los token de los usuarios
 * @param {object} user
 * @param {object} dev dispositivo
 * @param {string} exp expiration time in seconds
 * @param {bool} refresh Si es true el usaurio está recreando un token
 * @return {callback} cb
 */
const generateJwtToken = (user, device, exp, refresh, callback) => {
  console.log('generateToken');
  console.log(user);
  let expTime = exp || 86400*7;  // 7 days in seconds
  // let expTime = 60;  // 7 days in seconds
  let timestamp = Math.floor(Date.now() / 1000); // Now in seconds
  let channels = (user.channels && user.channels.length > 0) ? user.channels : [];
  let actions = [];

console.log('user.actions');
console.log(user.actions);
  if(user.actions && user.actions.length > 0) {
    actions = user.actions;
  } else {
    if(device && device.devType !== 'Web') {
      actions = ['revoke_token'];
    } else {
      actions = [];
    }
  }

  const ageMin = (user && user.ageMin) ? user.ageMin : '0';
  const gender = (user && user.gender) ? user.gender[0] : 'z'; // si existe guardamos el primer caracter
  const provider = (user && user.provider) ? user.provider[0] : 'z';
  const content  = `${ageMin}${gender}${provider}`;
  let premium  = {};
  let compArr = [];

  if(typeof user.premium !== 'undefined' && user.premium.length > 0) {
    premium = {
      'status': true,
      'to': user.premiumExpirationDate
    };
  } else {
    premium = {
      status: false,
      to: 0
    };
  }
  if(typeof user.company !== 'undefined' && user.company.length > 0) {
    for (var i = 0; i < user.company.length; i++) {
      console.log('-------------------'+ i +'---------------------')
      compArr.push({
        comp_id: user.company[i].comp_id,
        role: user.company[i].role
      });
      console.log(compArr);
    }
  }

  let claims = {
    sub: user._id,
    iss: config.adlu.url,
    iat: timestamp,
    scope: {
      role    : user.role || 'user',
      company : compArr,
      actions : actions,
      content : content,
      premium : [premium]
    },
    premium: premium
    // exp: timestamp + expTime // Se calcula solo
  };

  jwt.sign(claims, config.jwt.secret, { expiresIn: parseInt(expTime) }, function(error, token) {
    console.log('claims');
    console.log(claims);
    console.log(error);
    if(error) return callback(error, null);

    let tokens = {
      access_token: token  // jshint ignore:line
    };
    console.log(tokens);
    if((device === 'Web') || refresh) return callback(null, tokens);

    if(!device) {
      device = {};
      device.type = 'Unknown';
      device.name = 'Unknown';
    }
    
    let rtid = uuid.v4();
    let refreshTokenId = rtid.split('-').join('');  // Este es el token propiamente dicho
    let refreshToken = {  // Para almacenar en la base de datos
      userId: claims.sub,
      tokenId: refreshTokenId,
      createdAt: claims.iat,
      device: device
    };
    console.log('refresh');
    console.log(refreshToken);
    process.nextTick(function() {  // Async store token data
      _saveRefreshToken(refreshToken);
    });

    tokens.refresh_token = refreshTokenId;  // jshint ignore:line
    return callback(null, tokens);
  });
};

module.exports = {
  generateJwtToken
};
