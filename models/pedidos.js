var mongoose  = require('mongoose');

var schema = new mongoose.Schema({
	createAt    			: { type: Date, required: true, default: Date.now },  // always now
	parent			 		: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
	// location 				: { type : Array, required: false, "default" : [] },
	productId 				: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
	variant 	 			: { type : Array, required: false, "default" : [] }
	// vars		 			: { type : Array, required: false, "default" : [] }
});

// When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema.
// While nice for development, it is recommended this behavior be disabled in production since index creation can cause
// a significant performance impact. Disable the behavior by setting the autoIndex option of your schema to false.
schema.set('autoIndex', false);

module.exports = {
  'Stock': mongoose.model('Stock', schema)
};
