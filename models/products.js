var mongoose  = require('mongoose');

var schema = new mongoose.Schema({
	createAt    			: { type: Date, required: true, default: Date.now },  // always now
	brand	 				: { type: String, required: false, lowercase: true },
	measure 				: { type: String, required: false, lowercase: true },
	category 				: { type: String, required: false, lowercase: true },
	sort	 				: { type: String, required: false, lowercase: true },
	description 			: { type: String, required: false, lowercase: true },
	comestible	 			: { type: String, required: false, lowercase: true },
	fuente 		 			: { type: String, required: false, lowercase: true },
	variation 	 			: { type : Array, required: false, "default" : [] },
	nutritional 			: { type : Array, required: false, "default" : [] },
	status      			: { type: String, required: false }  // for failing power report & type of emotions
});

// When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema.
// While nice for development, it is recommended this behavior be disabled in production since index creation can cause
// a significant performance impact. Disable the behavior by setting the autoIndex option of your schema to false.
schema.set('autoIndex', false);

module.exports = {
  'Products': mongoose.model('Products', schema)
};
