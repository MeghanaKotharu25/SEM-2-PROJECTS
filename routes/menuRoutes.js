const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const menuController = require('../controllers/menuController');

// Utility middleware for validation
const validate = (validations) => async (req, res, next) => {
  for (let validation of validations) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Debug log when route file loads
console.log("📦 menuRoutes loaded");

// Base route: /api/menu

// GET all menu items
router.get('/', (req, res) => {
  console.log("📥 GET /api/menu hit");
  menuController.getMenu(req, res); // Ensure this method is defined in the menuController
});

// POST: Add new menu item
router.post(
  '/',
  validate([
    body('name').notEmpty().withMessage('Item name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('calories').optional().isNumeric().withMessage('Calories must be a number'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('category').optional().isString().withMessage('Category must be a string'),
  ]),
  menuController.addItem // Ensure this method is defined in the menuController
);

// PUT: Update item by ID
router.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid item ID'),
    body('name').optional().notEmpty().withMessage('Name must be provided if given'),
    body('price').optional().isNumeric().withMessage('Price must be numeric'),
    body('calories').optional().isNumeric().withMessage('Calories must be numeric'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('category').optional().isString().withMessage('Category must be a string'),
  ]),
  menuController.updateItem // Ensure this method is defined in the menuController
);

// DELETE: Remove item by ID
router.delete(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid item ID'),
  ]),
  menuController.deleteItem // Ensure this method is defined in the menuController
);

module.exports = router;

