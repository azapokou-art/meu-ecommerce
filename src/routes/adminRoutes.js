const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();


router.get('/dashboard', authMiddleware, adminMiddleware, adminController.getDashboard);
router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers);

module.exports = router;