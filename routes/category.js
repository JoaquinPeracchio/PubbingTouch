var express = require('express');
var router = express.Router();
var path = require('path');
var category = require('../controllers/category');
const authMiddleware = require('../middlewares/auth');

router.param('id', function(req, res, next, id) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/category/list.html'));
});

router.get('/register', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/category/register.html'));
});
router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), category.register);

router.get('/edit/:id', category.edit);
router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), category.update);

router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), category.delete);

router.post('/related', authMiddleware.checkJwtToken, category.getRelated);      // get user info

router.get('/list', authMiddleware.checkJwtToken, category.getList);  // all category populated

router.get('/populate', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), category.getPopulated);  // all category plain

module.exports = router;