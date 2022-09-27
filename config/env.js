'use strict';

const _ = require('lodash');
const fs = require('fs');

let env = process.env.NODE_ENV;
let config = require('../env/'+env+'.json');

if (fs.existsSync('env/'+env+'.local.json')) {
	let localConfig = require('../env/'+env+'.local.json');
	config = _.merge(config, localConfig);
}

module.exports = config;