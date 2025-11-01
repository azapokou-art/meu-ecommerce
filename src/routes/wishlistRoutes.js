const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

     
        const alreadyInWishlist = await Wishlist.isInWishlist(userId, productId);
        if (alreadyInWishlist) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        await Wishlist.addItem(userId, productId);

        res.json({
            success: true,
            message: 'Product added to wishlist successfully'
        });

    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/remove/:productId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;

        const removed = await Wishlist.removeItem(userId, productId);

        if (!removed) {
            return res.status(404).json({ error: 'Product not found in wishlist' });
        }

        res.json({
            success: true,
            message: 'Product removed from wishlist successfully'
        });

    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/my-wishlist', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const wishlist = await Wishlist.getUserWishlist(userId);

        res.json({
            success: true,
            wishlist: wishlist
        });

    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;