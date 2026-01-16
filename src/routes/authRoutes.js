const express = require('express');
const authController = require('../handler/authHandler');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);
router.delete('/account', authMiddleware, authController.deleteAccount);

module.exports = router;