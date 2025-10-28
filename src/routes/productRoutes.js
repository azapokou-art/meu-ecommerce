const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/', productController.getAll);
router.get('/search', productController.search);
router.get('/:id', productController.getById);


router.post('/', authMiddleware, productController.create);

module.exports = router;