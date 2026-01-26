const express = require('express');
const authHandler = require('../interface/handler/authHandler');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/register', authHandler.register);
router.post('/login', authHandler.login);
router.post('/forgot-password', authHandler.forgotPassword);
router.post('/reset-password', authHandler.resetPassword);

router.post('/logout', authMiddleware, authHandler.logout);
router.get('/profile', authMiddleware, authHandler.getProfile);
router.delete('/account', authMiddleware, authHandler.deleteAccount);
module.exports = router;