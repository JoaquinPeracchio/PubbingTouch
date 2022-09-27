const express = require('express');
const path = require('path');
const ejs = require('ejs');
const webpack = require('webpack');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('express-cors');
const passport = require('passport');
const session = require('express-session');
const RateLimit = require('express-rate-limit');
const useragent = require('useragent');
const jwt = require('jsonwebtoken');
process.env.NODE_ENV = process.env.NODE_ENV || 'production';


const config = require('./config/env');

let limiter = new RateLimit({
	windowMs: 60000, // 60 seconds
	max: 1000, // limit each IP to 1000 requests per windowMs
	delayMs: 0, // disable delaying - full speed until the max limit is reached
	//message: "Too many accounts created from this IP, please try again after an hour"
	handler: (req, res) => {
		let dNow = new Date();
		let user_id = null;
		let agent = useragent.parse(req.headers['user-agent']);
		let uaObj = {};
				uaObj.date = dNow.toISOString();
				uaObj.device = agent.device.toString();
				uaObj.platform = agent.toString();
				uaObj.ip = req.ip;
				uaObj.reqPath = req.originalUrl;

				console.log(uaObj);

		if(req.headers.authorization) {
			jwt.verify(req.headers.authorization, config.jwt.secret, { ignoreExpiration: false }, (err, decoded) => {
				if(err) {
					user_id = req.headers.authorization;
				} else {
					user_id = decoded;
				}

				uaObj.user = user_id;

				console.log(`Status 429: ${JSON.stringify(uaObj, null, 2)}`);
			});
		} else {
			uaObj.user = user_id;

			console.log(`Status 429: ${JSON.stringify(uaObj, null, 2)}`);
		}
	}
});

let app = express();

app.use(limiter);
app.disable('etag');

/**************************************************
** Define public routes
**************************************************/
app.use(express.static(path.join(__dirname, 'public'))); // puede que necesite esto
app.use(express.static(path.join(__dirname, 'uploads'))); // puede que necesite esto
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/**************************************************
* View engine setup
**************************************************/
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.renderFile);
app.set('view engine', 'ejs');

app.set('json spaces', 2);

if (process.env.NODE_ENV !== 'testing') app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.get('/*', function(req, res, next){ 
	res.setHeader('Last-Modified', (new Date()).toUTCString());
	next(); 
});

/**************************************************
* Allow Origins
**************************************************/
app.use(cors({
	allowedOrigins: config.adlu.cors,
	headers: [
		'Content-Type',
		'Authorization'
	]
}));

/**************************************************
* Database cx and models
**************************************************/
var db = require('./config/db');
var Users = require('./models/users');
var Config = require('./models/config');
var Category = require('./models/category');
var Offers = require('./models/offers');
var ProductBrand = require('./models/productbrand');
var Ingredients = require('./models/ingredients');
var Products = require('./models/products');
var Stock = require('./models/stock');
var Sales = require('./models/sales');
var Company = require('./models/company');
var Upload = require('./models/upload');
var Notification = require('./models/notification');
var Token = require('./models/tokens');  // Se almacenan los tokens

/**************************************************
* Define routes
**************************************************/
var indexRoute = require('./routes/index');
var usersRoute = require('./routes/users');
var configRoute = require('./routes/config');
var authRoute = require('./routes/auth');
var categoryRoute = require('./routes/category');
var offersRoute = require('./routes/offers');
var productBrandRoute = require('./routes/productbrand');
var ingredientsRoute = require('./routes/ingredients');
var productsRoute = require('./routes/products');
var stockRoute = require('./routes/stock');
var salesRoute = require('./routes/sales');
var companyRoute = require('./routes/company');
var uploadRoute = require('./routes/upload');
var notificationRoute = require('./routes/notification');
var tokensRoute = require('./routes/tokens');

/**************************************************
* Add routes previously
**************************************************/
app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use('/config', configRoute);
app.use('/category', categoryRoute);
app.use('/offers', offersRoute);
app.use('/productbrand', productBrandRoute);
app.use('/ingredients', ingredientsRoute);
app.use('/products', productsRoute);
app.use('/stock', stockRoute);
app.use('/sales', salesRoute);
app.use('/company', companyRoute);
app.use('/notification', notificationRoute);
app.use('/upload', uploadRoute);
app.use('/tokens', tokensRoute);
app.use('/auth', authRoute);
// app.use('/version', versionRoute);

/**************************************************
* Error handlers
**************************************************/
let env = process.env.NODE_ENV;
require('./config/error')(app, env);

module.exports = app;
