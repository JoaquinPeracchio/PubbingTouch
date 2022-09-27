'use strict';

const config = require('../config/env');
const mcache = require('memory-cache');

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
  let token = null;
  if(tokenArray) {
    let _t = tokenArray.split(' ');
    if(_t.length === 1) token = _t[0];
    if(_t.length === 2) token = _t[1];
  }
  return token;
};

/*
 * checkea que se este pasando el auth correspondiente
 * @Authorization header - bearer
 */
const checkIncomingAuth = (req, res, next) => {
  const key = _lookForToken(req.headers.authorization);

  if(key === config.incoming.key) return next();

  let err = new Error();
      err.status = 401;

  next(err);
};

/*
 * Funcion que cachea la respuesta del endpoing
 * @params { Number } duration - tiempo que debe chachear la respuesta en segundos
 */
const cacheData = duration => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      }
      next();
    }
  }
};

module.exports = { 
  checkIncomingAuth,
  cacheData
};
