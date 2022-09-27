var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
	createdAt			: { type: Date, required: true, default: Date.now },  // always now
	user_id				: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // jshint ignore:line 
	filename            : { type: String, required: false },  // codigo de pais
	path				: { type: String, required: false },  // codigo de pais
	destination			: { type: String, required: false },  // codigo de pais
	buffer				: { type: String, required: false },  // codigo de pais
	caption				: { type: String }
});

module.exports = {
  'Upload': mongoose.model('Upload', schema)
};
