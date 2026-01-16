const SupportTicket = require('../models/SupportTicket');

const supportController = {
    async createTicket(req, res) {
        try {
            const userId = req.user.userId;
            const { subject, description, priority = 'medium' } = req.body;

            if (!subject || !description) {
                return res.status(400).json({ error: 'Subject and description are required' });
            }

            const ticketId = await SupportTicket.create({
                user_id: userId,
                subject,
                description,
                priority
            });

            res.status(201).json({
                message: 'Support ticket created successfully',
                ticketId: ticketId
            });

        } catch (error) {
            console.error('Create ticket error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUserTickets(req, res) {
        try {
            const userId = req.user.userId;
            const tickets = await SupportTicket.findByUserId(userId);

            res.json({
                message: 'User tickets retrieved successfully',
                tickets: tickets,
                count: tickets.length
            });

        } catch (error) {
            console.error('Get user tickets error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getAllTickets(req, res) {
        try {
            const { status, limit = 50 } = req.query;
            const filters = {};
            
            if (status) filters.status = status;
            if (limit) filters.limit = parseInt(limit);

            const tickets = await SupportTicket.findAll(filters);

            res.json({
                message: 'All tickets retrieved successfully',
                tickets: tickets,
                count: tickets.length
            });

        } catch (error) {
            console.error('Get all tickets error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updateTicket(req, res) {
        try {
            const { ticketId } = req.params;
            const { status, admin_notes } = req.body;

            const success = await SupportTicket.update(ticketId, {
                status,
                admin_notes
            });

            if (!success) {
                return res.status(404).json({ error: 'Ticket not found' });
            }

            res.json({
                message: 'Ticket updated successfully'
            });

        } catch (error) {
            console.error('Update ticket error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = supportController;