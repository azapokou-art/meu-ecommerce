const Shipping = require('../models/Shipping');

const shippingController = {
    async getShippingMethods(req, res) {
        try {
            const shippingMethods = await Shipping.findAll();

            res.json({
                message: 'Shipping methods retrieved successfully',
                shippingMethods: shippingMethods
            });

        } catch (error) {
            console.error('Get shipping methods error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async calculateShipping(req, res) {
        try {
            const { shipping_method_id } = req.body;
            const userId = req.user?.userId;

            if (!shipping_method_id) {
                return res.status(400).json({ error: 'Shipping method ID is required' });
            }

            const shipping = await Shipping.calculateShipping(shipping_method_id);

            res.json({
                message: 'Shipping calculated successfully',
                shipping: shipping
            });

        } catch (error) {
            console.error('Calculate shipping error:', error);
            if (error.message === 'Método de entrega não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async calculateCartShipping(req, res) {
        try {
            const { shipping_method_id } = req.body;
            const userId = req.user.userId;

            if (!shipping_method_id) {
                return res.status(400).json({ error: 'Shipping method ID is required' });
            }


            const shipping = await Shipping.calculateShipping(shipping_method_id);

            res.json({
                message: 'Cart shipping calculated successfully',
                shipping: shipping
            });

        } catch (error) {
            console.error('Calculate cart shipping error:', error);
            if (error.message === 'Método de entrega não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = shippingController;