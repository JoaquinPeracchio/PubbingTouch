'use strict';

// Mounted on /version
const express      = require('express');
const router       = express.Router();

router.get('/android', (req, res) => {
  res.status(200).json({
    response: {
      minVersion: 270,
      version: 270,
      url: 'https://play.google.com/store/apps/details?id=live.watcha&hl=es'
    }
  });
});

module.exports = router;
