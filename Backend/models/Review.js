const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	reviewerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	carrierId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	},
	text: {
		type: String,
		required: true,
		maxlength: 500
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

reviewSchema.index({ reviewerId: 1, carrierId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);