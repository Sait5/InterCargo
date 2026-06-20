const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const config = require('./config');

dotenv.config();

const app = express();

app.use(cors({
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use("/api/users", require("./routes/userRoutes"));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/auctions', require('./routes/auctionRoutes'));

app.get('/api/test', (req, res) => {
	res.json({ message: 'Backend is running' });
});

mongoose.connect(config.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => {
	console.log('Connected to MongoDB');
	app.listen(process.env.PORT || 4000, () => {
		console.log(`Server running on port ${process.env.PORT || 4000}`);
	});
})
.catch((err) => {
	console.error('MongoDB connection error:', err.message);
	process.exit(1);
});