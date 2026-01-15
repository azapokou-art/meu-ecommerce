const express = require('express');
const categoryController = require('../handler/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.get('/:id/products', categoryController.getProducts);


router.post('/', authMiddleware, categoryController.create);

module.exports = router;