const router = require('express').Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { bookingRules } = require('../middleware/validate');

// POST /api/book-consultation — public, create booking
router.post('/', bookingRules, async (req, res, next) => {
  try {
    const { name, email, phone, serviceId, service: serviceName, message } = req.body;

    let serviceRef = null;

    // If serviceId provided, validate it exists and is available
    if (serviceId) {
      const foundService = await Service.findById(serviceId);
      if (!foundService) {
        return res.status(400).json({ error: 'Service not found' });
      }
      if (!foundService.availability) {
        return res.status(400).json({ error: 'This service is currently unavailable' });
      }
      serviceRef = foundService._id;
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      service: serviceRef,
      message: message || ''
    });

    // Populate service name in response
    await booking.populate('service', 'title price currency duration');

    res.json({
      message: 'Consultation booked successfully! We will contact you via WhatsApp/Telegram.',
      booking: {
        id: booking._id,
        status: booking.status,
        service: booking.service
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings — admin only, list all bookings
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('service', 'title price currency')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// PUT /api/bookings/:id — admin only, update booking status
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('service', 'title');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
