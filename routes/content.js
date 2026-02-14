const router = require('express').Router();
const Testimonial = require('../models/Testimonial');
const Program = require('../models/Program');

// GET /api/content/testimonials — public
router.get('/testimonials', async (req, res, next) => {
  try {
    const items = await Testimonial.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/content/programs — public
router.get('/programs', async (req, res, next) => {
  try {
    const items = await Program.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
