var mongoose           = require('mongoose'),
	bcrypt             = require('bcrypt'),
	SALT_WORK_FACTOR   = 10,
	MAX_LOGIN_ATTEMPTS = 7,
	LOCK_TIME          = 10 * 30 * 1000;

var schema = new mongoose.Schema({
	createdAt			: { type: Number, required: true, default: Date.now },  // always now
	avatar				: { type: Array, required: false, "default" : [] },
	username  			: { type: String, required: true, lowercase: true },
	firstname			: { type: String, required: true, lowercase: true },
	lastname			: { type: String, required: true, lowercase: true },
	gender				: { type: String, required: true, lowercase: true },
	email				: { type: String, required: true, lowercase: true },
	dialCode			: { type: String, required: false },  // codigo de pais
	phone				: { type: Number, required: false },
	country				: { type: String, required: true },
	region				: { type: String, required: true },
	city				: { type: String, required: true },
	postal				: { type: String, required: true },
	address				: { type: String, required: true },
	department			: { type: String, required: true },
	company	: [{
		comp_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
		role : { type: String, required: true, lowercase: true }
	}],
	locale				: { type: String, required: false, lowercase: true },
	accountType			: { type: String, required: true, default: 'user' },
	cuit				: { type: Number, required: false },
	nested : {
		stuff				: { type: String, required: false }
	},
	// Para identificar el rol y los permisos del usuario
	role: { type: String, required: true, default: 'user' },  // user, admin, operator, advertiser, ...
	actions: [{ type: String, require: true, default: 'revoke_token' }],  // revoke_token, edit_channels, ...
	password : { type: String, required: true },
	loginAttempts: { type: Number, required: false, default: 0 },
	lockUntil: { type: Number }
	// avatar			: { type: Array, required: false, "default" : 
							// [
							// 	{
							// 		"id" : "5e605250b898c60012433542",
							// 		"file" : "15833708320213 TURVALLISUUS.png"
							// 	}
							// ]
	// },
	// [{
	//     _id                    : { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
	//   },{
	//     role                  : { type: String, required: true, lowercase: true }
	// }],
	// avatar     : { type: String, required: true, 
	            // default: '/images/userImage.png' },
});

schema.pre('save', function (next) {
	var user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();
	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);
		// hash the password along with our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);
			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

schema.virtual('isLocked').get(function() {
	// check for a future lockUntil timestamp
	return !!(this.lockUntil && this.lockUntil > Date.now());
});

schema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

schema.methods.incLoginAttempts = function(cb) {
	// if we have a previous lock that has expired, restart at 1
	if (this.lockUntil && this.lockUntil < Date.now()) {
		return this.update({
			$set: { loginAttempts: 1 },
			$unset: { lockUntil: 1 }
		}, cb);
	}
	// otherwise we're incrementing
	var updates = { $inc: { loginAttempts: 1 } };
	// lock the account if we've reached max attempts and it's not locked already
	if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
		updates.$set = { lockUntil: Date.now() + LOCK_TIME };
	}
	return this.update(updates, cb);
};

// When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema.
// While nice for development, it is recommended this behavior be disabled in production since index creation can cause
// a significant performance impact. Disable the behavior by setting the autoIndex option of your schema to false.
schema.set('autoIndex', false);

module.exports = {
	'User': mongoose.model('User', schema)
};

