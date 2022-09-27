'use strict';

const express = require('express');
const router = express.Router();
const path		   = require('path');
const users = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');
const checkIncomingAuth = require('../middlewares/users').checkIncomingAuth;
const cacheData = require('../middlewares/users').cacheData;

router.param('id', function(req, res, next, id) {
	var regex = new RegExp(/^[0-9a-z]{24}$/);
	regex.test(id) ? next() : next('route');  // jshint ignore: line
});

router.param('type', function(req, res, next, type) {
	console.log(type);
});

router.get('/new', function(req, res, next) {
	res.render(path.join(__dirname + '/../views/register-user.html'));
});
router.get('/register', function(req, res, next) {
	res.render(path.join(__dirname + '/../views/users/register.html'));
});
// router.post('/register', users.handleAuth);
// router.post('/register', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), users.handleAuth);
router.post('/register', users.handleAuth);

router.delete('/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), users.delete); // delete 
router.get('/related', authMiddleware.checkJwtToken, users.getRelated);      // get user info

router.post('/finduser', authMiddleware.checkJwtToken, users.getByMail);      // get user info

router.get('/populate', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), users.getPopulated);  // all users plain
router.get('/list', authMiddleware.checkJwtToken, users.getList);  // all users populated
router.get('/userinfo', authMiddleware.checkJwtToken, users.getUser);      // get user info

router.get('/', function(req, res, next) {
	res.render(path.join(__dirname + '/../views/users/list.html'));
});


router.get('/edit/:id', users.edit);
router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), users.update);

router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), users.delete);





// router.get('/', function(req, res, next) {
//   res.render(path.join(__dirname + '/../views/users/users.html'));
// });

// router.get('/register', function(req, res, next) {
//   res.render(path.join(__dirname + '/../views/users/register.html'));
// });

// // router.delete('/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), users.deleteUser); // delete user
// router.get('/userinfo', authMiddleware.checkJwtToken, users.getUser);      // get user info
// router.get('/getuserbyid/:id', authMiddleware.checkJwtToken, users.getUserById);      // get user info
// router.get('/list', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), users.getUserList);      // get all users
// router.post('/renewpassword', users.postRenewPassword);  // get code to renew password
// router.post('/codeexist', users.postRenderRenew); // check if code is active
// router.post('/updatepassword', users.postUpdatePassword); // update password of user
// router.get('/totalandgender', checkIncomingAuth, cacheData(21600), users.getUsers); // get data of num or users and sorted by gender

// router.get('/edit/:id', users.edit);
// router.post('/update/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), users.update);

// router.post('/delete/:id', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), users.delete);

module.exports = router;
