var mongoose  = require('mongoose');

var schema = new mongoose.Schema({
	createAt    			: { type: Date, required: true, default: Date.now },  // always now
	avatar 					: { type : Array, required: false, "default" : [] },
	titlename 				: { type: String, required: true, lowercase: true },
	slogan	 				: { type: String, required: true, lowercase: true },
	cuit 					: { type: String, required: true },
	address	 				: { type: String, required: false,"default" : {}  },
	department 				: { type: String, required: false,"default" : {}  },
	city	 				: { type: String, required: false,"default" : {}  },
	region	 				: { type: String, required: false,"default" : {}  },
	country	 				: { type: String, required: false,"default" : {}  },
	postal	 				: { type: String, required: false,"default" : {}  },
	phone		 			: { type: String, required: false },
	location_lat			: { type: String, required: false },
	location_lon			: { type: String, required: false },
	files 					: { type : Array, required: false, "default" : [] },
	admin_id     			: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // jshint ignore:line 
	status      			: { type: String, required: false }  // for failing power report & type of emotions
});

// When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema.
// While nice for development, it is recommended this behavior be disabled in production since index creation can cause
// a significant performance impact. Disable the behavior by setting the autoIndex option of your schema to false.
schema.set('autoIndex', false);

module.exports = {
  'Company': mongoose.model('Company', schema)
};
