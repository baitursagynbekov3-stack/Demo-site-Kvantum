const router = require('express').Router();
const Service = require('../models/Service');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { serviceRules } = require('../middleware/validate');

// GET /api/services — public, list all available services
router.get('/', async (req, res, next) => {
  try {
    const services = await Service.find({ availability: true }).sort({ createdAt: 1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
});

// GET /api/services/:id — public, single service
router.get('/:id', async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    next(err);
  }
});

// POST /api/services — admin only, create service
router.post('/', authenticateToken, requireAdmin, serviceRules, async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ message: 'Service created', service });
  } catch (err) {
    next(err);
  }
});

// PUT /api/services/:id — admin only, update service
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service updated', service });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/services/:id — admin only
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
