var express = require('express');
var router = express.Router();
var path = require('path');
var offers = require('../controllers/offers');
const authMiddleware = require('../middlewares/auth');

router.param('id', function(req, res, next, id) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/offers/list.html'));
});

router.get('/register', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/offers/register.html'));
});
router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), offers.register);

router.get('/edit/:id', offers.edit);
router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), offers.update);

router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), offers.delete);

router.post('/related', authMiddleware.checkJwtToken, offers.getRelated);      // get user info

router.get('/list', authMiddleware.checkJwtToken, offers.getList);  // all offers populated

router.get('/populate', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), offers.getPopulated);  // all offers plain

module.exports = router;