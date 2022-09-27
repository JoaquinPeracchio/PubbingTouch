var mongoose  = require('mongoose');

var schema = new mongoose.Schema({
	createAt    			: { type: Date, required: true, default: Date.now },  // always now
	avatar 					: { type : Array, required: false, "default" : [] },
	titlename 				: { type: String, required: true, lowercase: true },
	sort	 				: { type: String, required: false, lowercase: true },
	slogan 					: { type: String, required: true, lowercase: true },
	description 			: { type: String, required: false, lowercase: true },
	products 	 			: { type : Array, required: false, "default" : [] },
	status      			: { type: Boolean, required: false, "default": true }  // for failing power report & type of emotions
});

// When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema.
// While nice for development, it is recommended this behavior be disabled in production since index creation can cause
// a significant performance impact. Disable the behavior by setting the autoIndex option of your schema to false.
schema.set('autoIndex', false);

module.exports = {
  'ProductBrand': mongoose.model('ProductBrand', schema)
};
