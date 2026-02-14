const router = require('express').Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { profileRules } = require('../middleware/validate');

// GET /api/profile — get current user's profile
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/profile — update current user's profile
router.put('/', authenticateToken, profileRules, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone !== undefined) updates.phone = phone;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
