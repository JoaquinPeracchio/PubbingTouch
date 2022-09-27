var express = require('express');
var router = express.Router();
var tokens = require('../controllers/tokens');
const authMiddleware = require('../middlewares/auth');

// Valido parametro userid
router.param('userid', function(req, res, next, userid) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(userid) ? next() : next('route');  // jshint ignore: line
});

// /v1/tokens/
router.post('/revoke', authMiddleware.checkJwtToken, tokens.revokeToken);  // Revoco un refresh_token a partir de un access_token
router.post('/refresh', tokens.generateAccessToken);  // Genero un access_token a partir de un refresh_token
//router.post('/extend', tokens.extendAccessToken);  // Extiendo la duración de un access_token. Para Web solamente
router.get('/:userid', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), tokens.getUserTokensList);
router.get('/', authMiddleware.checkJwtToken, tokens.getTokensList);  // Listo todos mis refresh_tokens. Si soy admin listo todos

module.exports = router;
