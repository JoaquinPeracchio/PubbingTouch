var express = require('express');
var router = express.Router();
var path = require('path');
var notification = require('../controllers/notification');
const authMiddleware = require('../middlewares/auth');

router.param('id', function(req, res, next, id) {
  var regex = new RegExp(/^[0-9a-z]{24}$/);
  regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.delete('/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), notification.delete); // delete 
router.post('/related', authMiddleware.checkJwtToken, notification.getRelated);      // get user info

router.get('/populate', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), notification.getPopulated);  // all notification plain
router.get('/list', authMiddleware.checkJwtToken, notification.getList);  // all notification populated

router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/notification/list.html'));
});

router.get('/register', function(req, res, next) {
  res.render(path.join(__dirname + '/../views/notification/register.html'));
});

router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), notification.register);

router.get('/edit/:id', notification.edit);

router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), notification.update);

router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), notification.delete);

module.exports = router;