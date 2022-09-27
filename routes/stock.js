var express = require('express');
var router = express.Router();
var path = require('path');
var stock = require('../controllers/stock');
const authMiddleware = require('../middlewares/auth');

router.param('id', function(req, res, next, id) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/stock/list.html'));
});

router.get('/register', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/stock/register.html'));
});

router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), stock.register);

router.get('/edit/:id', stock.edit);
router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), stock.update);

router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), stock.delete);

router.post('/getRelated', authMiddleware.checkJwtToken, stock.getRelated);      // get user info
router.post('/related', authMiddleware.checkJwtToken, stock.getRelated);      // get user info

router.get('/list', stock.getList);  // all stock populated

router.get('/populate', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), stock.getPopulated);  // all stock plain

module.exports = router;