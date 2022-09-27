var mongoose  = require('mongoose');

var schema = new mongoose.Schema({
	createAt    		: { type: Date, required: true, default: Date.now },  // always now
	titlename	 		: { type: String, required: false },
	category	 		: { type: String, required: false },
	parent			 	: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: false },
	related_id		 	: { type: mongoose.Schema.Types.ObjectId, required: false },
	files				: { type: Array, required: false, "default" : [] },
	percent		 		: { type: String, required: false },
	expiration			: { type: Date, required: false },
	comment		 		: { type: String, required: false },
	status      		: { type: String, required: false }  // for failing power report & type of emotions
});

// When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema.
// While nice for development, it is recommended this behavior be disabled in production since index creation can cause
// a significant performance impact. Disable the behavior by setting the autoIndex option of your schema to false.
schema.set('autoIndex', false);

module.exports = {
  'Notification': mongoose.model('Notification', schema)
};
