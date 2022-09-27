var express = require('express');
var router = express.Router();
var path = require('path');
var sales = require('../controllers/sales');
const authMiddleware = require('../middlewares/auth');

router.param('id', function(req, res, next, id) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/sales/list.html'));
});

router.get('/register', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/sales/register.html'));
});

router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), sales.register);

router.get('/edit/:id', sales.edit);
router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), sales.update);

router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), sales.delete);

router.post('/related', authMiddleware.checkJwtToken, sales.getRelated);      // get user info

router.post('/search', sales.getBy);      // get user info

router.get('/find/:id', sales.findEl);      // get user info

router.get('/list', sales.getList);  // all sales populated

router.get('/populate', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), sales.getPopulated);  // all sales plain

module.exports = router;