const express = require('express');
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/validate', authMiddleware, couponController.validate);


router.post('/', authMiddleware, adminMiddleware, couponController.create);
router.get('/', authMiddleware, adminMiddleware, couponController.getAll);
router.put('/:couponId', authMiddleware, adminMiddleware, couponController.update);

module.exports = router;