'use strict';

// Mounted on /auth
const express      = require('express');
const router       = express.Router();
const path		   = require('path');
const config       = require('../config/env');
// const registerWatchaUser = require('../controllers/auth')._registerWatchaUser;
const authController = require('../controllers/auth');
const authMiddleware    = require('../middlewares/auth');
const passport        = require('passport');

// TODO. Pasar este GET a POST y utilizar 'filterAuth' como middleware
router.post('/user', authMiddleware.hasJwtToken, authMiddleware.filterAuth, authController.handleAuth);  // Para la versión mobile y Web
// router.post('/owner', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner'), authMiddleware.filterOwnerAuth, authController.handleOwnerAuth);  // Para la versión mobile y Web
// router.post('/admin', authMiddleware.checkJwtToken, authMiddleware.allowRole('owner', 'admin'), authMiddleware.filterAdminAuth, authController.handleAdminAuth);  // Para la versión mobile y Web

module.exports = router;
