var express = require('express');
var router = express.Router();
var path = require('path');
var productBrand = require('../controllers/productbrand');
const authMiddleware = require('../middlewares/auth');

router.param('id', function(req, res, next, id) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/productBrand/list.html'));
});

router.get('/register', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/productBrand/register.html'));
});

router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), productBrand.register);

router.get('/edit/:id', productBrand.edit);
router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), productBrand.update);

router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), productBrand.delete);

router.post('/related', authMiddleware.checkJwtToken, productBrand.getRelated);      // get user info

router.post('/search', productBrand.getBy);      // get user info

router.get('/list', productBrand.getList);  // all productBrand populated

router.get('/populate', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), productBrand.getPopulated);  // all productBrand plain

module.exports = router;