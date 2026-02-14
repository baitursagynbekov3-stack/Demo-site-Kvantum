require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const SERVE_STATIC = process.env.SERVE_STATIC !== 'false';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  }
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

if (SERVE_STATIC) {
  app.use(express.static(path.join(__dirname, 'public')));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/services', require('./routes/services'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/book-consultation', require('./routes/bookings'));
app.use('/api/payment', require('./routes/payments'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/notify', require('./routes/notify'));
app.use('/api/content', require('./routes/content'));
app.use('/api/admin', require('./routes/admin'));

// Serve frontend for all other routes
if (SERVE_STATIC) {
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  });
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`KVANTUM server running at http://localhost:${PORT}`);
});

// Export for Vercel serverless
module.exports = app;
