const express = require('express');
const supportController = require('../handler/supportController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/tickets', authMiddleware, supportController.createTicket);
router.get('/tickets', authMiddleware, supportController.getUserTickets);

router.get('/admin/tickets', authMiddleware, adminMiddleware, supportController.getAllTickets);
router.patch('/admin/tickets/:ticketId', authMiddleware, adminMiddleware, supportController.updateTicket);

module.exports = router;