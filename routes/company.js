var express = require('express');
var router = express.Router();
var path = require('path');
var company = require('../controllers/company');
const authMiddleware = require('../middlewares/auth');

router.param('id', function(req, res, next, id) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.delete('/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), company.delete); // delete 
router.get('/related', authMiddleware.checkJwtToken, company.getRelated);      // get user info
router.post('/getRelated', authMiddleware.checkJwtToken, company.related);      // get user info

router.get('/populate', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), company.getPopulated);  // all company plain
router.get('/list', authMiddleware.checkJwtToken, company.getList);  // all company populated

router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/company/list.html'));
});

router.get('/register', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/company/register.html'));
});

router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), company.register);

router.get('/edit/:id', company.edit);
router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), company.update);

router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), company.delete);

module.exports = router;