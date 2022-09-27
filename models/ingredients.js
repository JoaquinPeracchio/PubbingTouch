var mongoose  = require('mongoose');

var schema = new mongoose.Schema({
	createAt    			: { type: Date, required: true, default: Date.now },  // always now
	parent			 		: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
	avatar 					: { type : Array, required: false, "default" : [] },
	titlename 				: { type: String, required: true, lowercase: true },
	cost 					: { type: String, required: true, lowercase: true },
	measure 				: { type: String, required: true, lowercase: true },
	quantity 				: { type: String, required: true, lowercase: true },
	description 			: { type: String, required: false, lowercase: true },
	nutritional 			: { type : Array, required: false, "default" : [] },
	user_id     			: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // jshint ignore:line 
	status      			: { type: String, required: false }  // for failing power report & type of emotions
});

// When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema.
// While nice for development, it is recommended this behavior be disabled in production since index creation can cause
// a significant performance impact. Disable the behavior by setting the autoIndex option of your schema to false.
schema.set('autoIndex', false);

module.exports = {
  'Ingredients': mongoose.model('Ingredients', schema)
};
