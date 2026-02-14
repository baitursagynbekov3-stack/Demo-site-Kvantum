const mongoose = require('mongoose');

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Don't crash the server — allow it to run without DB for static serving
    console.error('Server will continue without database functionality');
  }
};

module.exports = connectDB;
