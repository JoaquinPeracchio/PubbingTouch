var express = require('express');
var router = express.Router();
var path = require('path');
var configuration = require('../controllers/config');
const authMiddleware = require('../middlewares/auth');

router.param('id', function(req, res, next, id) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.get('/configinfo', authMiddleware.checkJwtToken, configuration.getRelated);      // get user info
router.get('/list', authMiddleware.checkJwtToken, configuration.getList);  // all configuration populated

// /v1/config/channel/{chid}/from/{date}/to/{date}/
// /v1/config/channel/{chid}/from/{date}/to/{date}/populate
// /v1/config/channel/{chid}/from/{date}/to/{date}/count

// POST action=zapping; state=ch5
router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/config/list.html'));
});

router.get('/register', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/config/register.html'));
});

router.get('/edit', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/config/edit.html'));
});

router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), configuration.register);
router.post('/edit', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), configuration.edit);

module.exports = router;
