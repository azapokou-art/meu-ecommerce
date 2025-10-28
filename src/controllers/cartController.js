const Cart = require('../models/Cart');

const cartController = {
    async addItem(req, res) {
        try {
            const userId = req.user.userId;
            const { productId, quantity } = req.body;

            if (!productId) {
                return res.status(400).json({ error: 'Product ID is required' });
            }

            const success = await Cart.addItem(userId, productId, quantity || 1);

            if (success) {
                res.json({ 
                    message: 'Product added to cart successfully'
                });
            } else {
                res.status(400).json({ error: 'Failed to add product to cart' });
            }

        } catch (error) {
            console.error('Add to cart error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getCart(req, res) {
        try {
            const userId = req.user.userId;
            const cartItems = await Cart.findByUserId(userId);

            const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

            res.json({
                message: 'Cart retrieved successfully',
                cart: cartItems,
                total: total.toFixed(2),
                itemCount: cartItems.length
            });

        } catch (error) {
            console.error('Get cart error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updateQuantity(req, res) {
        try {
            const userId = req.user.userId;
            const { productId, quantity } = req.body;

            if (!productId || quantity < 1) {
                return res.status(400).json({ error: 'Valid product ID and quantity are required' });
            }

            const success = await Cart.updateQuantity(userId, productId, quantity);

            if (success) {
                res.json({ 
                    message: 'Cart updated successfully'
                });
            } else {
                res.status(404).json({ error: 'Item not found in cart' });
            }

        } catch (error) {
            console.error('Update cart error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async removeItem(req, res) {
        try {
            const userId = req.user.userId;
            const { productId } = req.body;

            if (!productId) {
                return res.status(400).json({ error: 'Product ID is required' });
            }

            const success = await Cart.removeItem(userId, productId);

            if (success) {
                res.json({ 
                    message: 'Item removed from cart successfully'
                });
            } else {
                res.status(404).json({ error: 'Item not found in cart' });
            }

        } catch (error) {
            console.error('Remove from cart error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = cartController;