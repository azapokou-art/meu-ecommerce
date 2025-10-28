const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/product/:productId', reviewController.getProductReviews);

router.post('/', authMiddleware, reviewController.create);
router.get('/my-reviews', authMiddleware, reviewController.getUserReviews);

module.exports = router;