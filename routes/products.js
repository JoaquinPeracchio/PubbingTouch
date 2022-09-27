var express = require('express');
var router = express.Router();
var path = require('path');
var products = require('../controllers/products');
const authMiddleware = require('../middlewares/auth');

router.param('id', function(req, res, next, id) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/products/list.html'));
});

router.get('/register', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/products/register.html'));
});

router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), products.register);

router.get('/edit/:id', products.edit);
router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), products.update);

router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), products.delete);

router.post('/related', authMiddleware.checkJwtToken, products.getRelated);      // get user info

router.post('/search', products.getBy);      // get user info

router.get('/find/:id', products.findEl);      // get user info

router.get('/list', products.getList);  // all products populated

router.get('/populate', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), products.getPopulated);  // all products plain

module.exports = router;