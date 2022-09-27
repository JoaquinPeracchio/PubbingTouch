'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const version = require('../package.json').version;

router.get('/', function(req, res, next) {
  // const api = {
  //   owner: 'Watcha Live',
  //   version: version || 'Unknown',
  //   msg: 'Have fun..'
  // };
  // res.json(api);
  res.render(path.join(__dirname + '/../views/index.html'));
});


module.exports = router;
