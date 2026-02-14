const router = require('express').Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Testimonial = require('../models/Testimonial');
const Program = require('../models/Program');
const Service = require('../models/Service');

// All admin routes require auth + admin role
router.use(authenticateToken, requireAdmin);

// GET /api/admin/check — verify admin access
router.get('/check', (req, res) => {
  res.json({ isAdmin: true });
});

// ===== Testimonials =====

router.get('/testimonials', async (req, res, next) => {
  try {
    const items = await Testimonial.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/testimonials', async (req, res, next) => {
  try {
    const item = await Testimonial.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/testimonials/:id', async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/testimonials/:id', async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

// ===== Programs =====

router.get('/programs', async (req, res, next) => {
  try {
    const items = await Program.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/programs', async (req, res, next) => {
  try {
    const item = await Program.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/programs/:id', async (req, res, next) => {
  try {
    const item = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/programs/:id', async (req, res, next) => {
  try {
    const item = await Program.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

// ===== Services =====

router.get('/services', async (req, res, next) => {
  try {
    const items = await Service.find().sort({ createdAt: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
