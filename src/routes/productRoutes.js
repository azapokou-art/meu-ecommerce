const express = require('express');
const productController = require('../interface/handler/productHandler');
const productImageHandler = require('../interface/handler/productImageHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../infrastructure/upload');


const router = express.Router();


router.get('/', productController.getAll);
router.get('/search', productController.search);
router.get('/:id', productController.getById);


router.post('/', authMiddleware, productController.create);
router.post('/upload', authMiddleware, upload.single('image'), productImageHandler.upload);

module.exports = router;