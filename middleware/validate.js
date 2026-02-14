const { body, validationResult } = require('express-validator');

// Run validations and check for errors — returns a single middleware function
const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
        errors: errors.array()
      });
    }
    next();
  };
};

// Registration validation
const registerRules = validate([
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]);

// Login validation
const loginRules = validate([
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
]);

// Profile update validation
const profileRules = validate([
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim()
]);

// Post validation
const postRules = validate([
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Post body is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
]);

// Service validation
const serviceRules = validate([
  body('title').trim().notEmpty().withMessage('Service title is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('currency').optional().isIn(['KGS', 'USD', 'RUB']).withMessage('Currency must be KGS, USD, or RUB'),
  body('duration').optional().trim()
]);

// Booking validation
const bookingRules = validate([
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone is required')
]);

module.exports = {
  registerRules,
  loginRules,
  profileRules,
  postRules,
  serviceRules,
  bookingRules
};
