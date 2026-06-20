const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
	bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	bidderName: { type: String, required: true },
	bidderCompany: { type: String, default: '' },
	amount: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now }
});

const auctionSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	route: { type: String, required: true },
	cargoType: { type: String, required: true },
	volume: { type: String, required: true },
	startPrice: { type: Number, required: true, min: 0 },
	currentPrice: { type: Number, required: true, min: 0 },
	dateFrom: { type: Date, required: true },
	dateTo: { type: Date, required: true },
	description: { type: String, maxlength: 500, default: '' },
	creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	creatorName: { type: String, required: true },
	accessType: { type: String, enum: ['public', 'private'], default: 'public' },
	allowedCarriers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	status: { type: String, enum: ['draft', 'active', 'completed', 'cancelled'], default: 'draft' },
	bids: [bidSchema],
	winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
	winnerName: { type: String, default: '' },
	startsAt: { type: Date, default: null },
	endsAt: { type: Date, default: null },
	createdAt: { type: Date, default: Date.now }
});

auctionSchema.index({ status: 1, endsAt: 1 });
auctionSchema.index({ creatorId: 1 });

module.exports = mongoose.model('Auction', auctionSchema);