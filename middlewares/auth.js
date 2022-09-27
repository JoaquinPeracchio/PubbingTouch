'use strict';

let config = require('../config/env');
var jwt = require('jsonwebtoken');
var _ = require('lodash/string');
var CryptoJS = require('crypto-js');
var UAParser = require('ua-parser-js');

/**
 * Check if user is admin through token's payload
 */
const allowRole = (...allowed) => {
// export default function permit(...allowed) {
  const isAllowed = role => allowed.indexOf(role) > -1;

  // return a middleware
  return (req, res, next) => {
    console.log(req.user);
    if (req.user && isAllowed(req.user.scope.role)) {
      console.log('isAllowed');
      next(); // role is allowed, so continue on the next middleware
    } else {
      console.log('notAllowed');
      res.status(403).json({message: "Forbidden"}); // user is forbidden
    }
  }
};

/**
 * Check if user is admin through token's payload
 */
const allowAction = (...allowed) => {
// export default function permit(...allowed) {
  const isAllowed = role => allowed.indexOf(action) > -1;

  // return a middleware
  return (req, res, next) => {
    console.log(req.user);
    if (req.user && isAllowed(req.user.scope.action)) {
      console.log('isAllowed action');
      next(); // role is allowed, so continue on the next middleware
    } else {
      res.status(403).json({message: "Forbidden"}); // user is forbidden
    }
  }
};

/**
 * Check if user is admin through token's payload
 */
const requireAdmin = (req, res, next) => {

  // req.user ==> jwt payload
  console.log('require admin');
  if(req.user.scope.role === 'admin') return next();

  var err = new Error();
      console.log('error');
      err.status = 401;
  next(err);
};

/**
 * Funcion privada para buscar tokens
 * en el encabezado (req.headers.authorization)
 * de cada pedido
 * @param  {array} authHeader encabezados
 * @return {string}           token encontrado o null
 */
const _lookForToken = (authHeader) => {
  // Authorization: <token> ||
  // Authorization: Bearer <token> 
  let tokenArray = authHeader;
  console.log('tokenArray');
  console.log(tokenArray);
  let token = null;
  if(tokenArray) {
    let _t = tokenArray.split(' ');
    if(_t.length === 1) token = _t[0];
    if(_t.length === 2) token = _t[1];
  }
  return token;
};

/**
 * check if passed token its valid and not expired
 */
const hasJwtToken = (req, res, next) => {
  console.log('que pasa?');
  console.log(req.body);
  console.log('req.body');
  console.log(req.params);
  console.log('req.params');

console.log(req.headers);
  console.log('req.headers');
  
//        req.user = decoded;
        // return next();
  let token = _lookForToken(req.headers.authorization);
  if(token) {
    // Verifies secret and checks exp
    console.log(token);
    jwt.verify(token, config.jwt.secret, { ignoreExpiration: false }, function(error, decoded) { 
      if(error) {
        var err = new Error();
            err.status = 401;
        return next(err);
      } else {
        req.user = decoded;
        return next();
      }
    });
  } else {
    console.log('notoken');
    // if no token
    return next();
  }
};

/**
 * check if passed token its valid and not expired
 */
const checkJwtToken = (req, res, next) => {
//        req.user = decoded;
        // return next();
  let token = _lookForToken(req.headers.authorization);
  console.log('token');
  console.log(token);
  if(token) {
    // Verifies secret and checks exp
    jwt.verify(token, config.jwt.secret, { ignoreExpiration: false }, function(error, decoded) { 
      if(error) {
        var err = new Error();
            err.status = 401;
        return next(err);
      } else {
        req.user = decoded;
        return next();
      }
    });
  } else {
    console.log('notoken123');
    console.log('notoken');
    // if no token
    var err = new Error();
        err.status = 401;
    return next(err);
  }
};

/**
 * Function para manejar la 
 * autenticacion de usuarios desde
 * la app Web
 */
const handleWebFbAuth = (req, res, next) => {
  console.log(req.body);
  console.log('req.body');
  let access_token = req.params.token || null;  // jshint ignore:line
  if(!access_token) {  // jshint ignore:line
    let err = new Error();
        err.status = 401;
    return next(err);
  }

  // Paso la info del usuario a req.user
  let user = {
    token: req.params.token,
    device: { devType: 'Web' }
  };
  req.user = user;
  return next();
};

/**
 * Filtro de parámetros para método POST
 * Sirve para solicitudes Web y Móviles
 */
const filterAuthAll = (req, res, next) => {
  let body = req.body;
  let provider = body.provider || req.originalUrl.split('/')[2];
  let token = body.fbToken || body.twTokenKey || null;
  let tokenSecret = body.twTokenSecret || null;
  let secToken = body.secToken || 'empty';  // Security token = token cifrado con passphrase 
  let devType = body.devType || 'Mobile';
  let devName = body.devName || null;  // Solo para móviles. Se manda desde la app
  let passphrase = config.crypto.secret;

  if(!token) {
    let err = new Error();
    err.status = 401;
    return next(err);
  }

  // Validación para dispositivos móviles
  if(devType !== 'Web' && (!token || !secToken)) {
    let err = new Error();
    err.status = 401;
    return next(err);
  }

  let device = {};
  device.type = _.capitalize(devType);

  if (devType === 'Web') {
    var parser = new UAParser();
    var ua = req.headers['user-agent'];
    device.name = parser.setUA(ua).getBrowser().name || null;
    device.version = parser.setUA(ua).getBrowser().version || null;
    if (!device.name) device.version = null;
  } else {
    /**
     * Solamente para dispositivos móviles
     * En la vista se cifra el token de la red social (fb/tw) con el passphrase
     * Luego, una vez pasado a texto plano se compara con el original para ver si 
     * son iguales.
     */
    device.name = devName;
    // Desencripto el secToken
    let bytes  = CryptoJS.AES.decrypt(secToken.toString(), passphrase);
    let plaintext = bytes.toString(CryptoJS.enc.Utf8);

    // Comparo lo de arriba con el token (facebook/twitter)
    if(plaintext !== token.toString()) {
      let err = new Error();
      err.status = 401;
      return next(err);    
    }
  }

  // Paso la info del usuario a req.user
  let user = {
    provider,
    token,
    tokenSecret,
    device
  };
  req.user = user;    
  
  return next(); 
};

/**
 * Function para manejar la 
 * autenticacion de usuarios desde
 * la app Web
 */
const filterAuth = (req, res, next) => {
  let access_token = req.params.token || req.query.token || req.headers.authorization || null;  // jshint ignore:line

  // Paso la info del usuario a req.user
  let user = {
    token: req.params.token
  };

  if(access_token) {  // jshint ignore:line
    let user = {
      token: req.params.token,
      userId: req.user.sub
    };
  }

  req.user = user;
  console.log('user-------------------');
  console.log(user);
  return next();
};


module.exports = {
  allowRole,
  allowAction,
  requireAdmin,
  hasJwtToken,
  checkJwtToken,
  filterAuth,
};
