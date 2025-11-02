const Review = require('../models/Review');

const reviewController = {
    async create(req, res) {
    try {
        const userId = req.user.userId;
        const { productId, rating, comment, image_url } = req.body;

    
        if (!productId || !rating) {
            return res.status(400).json({ error: 'Product ID and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        
        const existingReview = await Review.findByUserAndProduct(userId, productId);
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        
        const reviewId = await Review.create({
            userId,
            productId,
            rating,
            comment: comment || '',
            image_url: image_url || null
        });

    
        const averageRating = await Review.getProductAverageRating(productId);

        res.status(201).json({ 
            message: 'Review created successfully',
            reviewId: reviewId,
            averageRating: parseFloat(averageRating.average_rating || 0).toFixed(1),
            reviewCount: averageRating.review_count
        });

    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
},

    async getProductReviews(req, res) {
        try {
            const { productId } = req.params;
            const reviews = await Review.findByProductId(productId);
            const averageRating = await Review.getProductAverageRating(productId);

            res.json({
                message: 'Product reviews retrieved successfully',
                reviews: reviews,
                averageRating: parseFloat(averageRating.average_rating || 0).toFixed(1),
                reviewCount: averageRating.review_count
            });

        } catch (error) {
            console.error('Get product reviews error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUserReviews(req, res) {
        try {
            const userId = req.user.userId;
            const reviews = await Review.findByUserId(userId);

            res.json({
                message: 'User reviews retrieved successfully',
                reviews: reviews,
                count: reviews.length
            });

        } catch (error) {
            console.error('Get user reviews error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = reviewController;