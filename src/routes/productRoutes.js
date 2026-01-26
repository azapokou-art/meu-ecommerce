const express = require('express');
const productController = require('../interface/handler/productHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../infrastructure/upload');

const router = express.Router();

// Rotas públicas
router.get('/', productController.getAll);
router.get('/search', productController.search);
router.get('/:id', productController.getById);

// Rotas protegidas (apenas admin)
router.post('/', authMiddleware, productController.create);
router.post('/upload', authMiddleware, upload.single('image'), productController.uploadImage);

module.exports = router;