var express = require('express');
var router = express.Router();
var path = require('path');
var ingredients = require('../controllers/ingredients');
const authMiddleware = require('../middlewares/auth');

router.param('id', function(req, res, next, id) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/ingredients/list.html'));
});

router.get('/register', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/ingredients/register.html'));
});

router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), ingredients.register);

router.get('/edit/:id', ingredients.edit);
router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), ingredients.update);

router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), ingredients.delete);

router.post('/related', authMiddleware.checkJwtToken, ingredients.getRelated);      // get user info

router.get('/list', authMiddleware.checkJwtToken, ingredients.getList);  // all ingredients populated

router.get('/populate', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), ingredients.getPopulated);  // all ingredients plain

module.exports = router;