const express = require('express');
const couponHandler = require('../interface/handler/couponHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/validate', authMiddleware, couponHandler.validate);

router.post('/', authMiddleware, adminMiddleware, couponHandler.create);
router.get('/', authMiddleware, adminMiddleware, couponHandler.getAll);
router.put('/:couponId', authMiddleware, adminMiddleware, couponHandler.update);

module.exports = router;