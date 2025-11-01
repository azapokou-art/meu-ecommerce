const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');


router.get('/sales-monthly', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { months = 6 } = req.query;
        const salesData = await Report.getSalesByMonth(parseInt(months));

        res.json({
            success: true,
            period: `${months} meses`,
            data: salesData
        });

    } catch (error) {
        console.error('Sales monthly report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/top-products', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const topProducts = await Report.getTopProducts(parseInt(limit));

        res.json({
            success: true,
            limit: parseInt(limit),
            products: topProducts
        });

    } catch (error) {
        console.error('Top products report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/customer-stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const customerStats = await Report.getCustomerStats();

        res.json({
            success: true,
            stats: customerStats
        });

    } catch (error) {
        console.error('Customer stats report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/financial-metrics', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const financialMetrics = await Report.getFinancialMetrics();

        res.json({
            success: true,
            period: 'Últimos 30 dias',
            metrics: financialMetrics
        });

    } catch (error) {
        console.error('Financial metrics report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/sales-by-category', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const categorySales = await Report.getSalesByCategory();

        res.json({
            success: true,
            categories: categorySales
        });

    } catch (error) {
        console.error('Sales by category report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [
            salesMonthly,
            topProducts, 
            customerStats,
            financialMetrics,
            salesByCategory
        ] = await Promise.all([
            Report.getSalesByMonth(6),
            Report.getTopProducts(5),
            Report.getCustomerStats(),
            Report.getFinancialMetrics(),
            Report.getSalesByCategory()
        ]);

        res.json({
            success: true,
            dashboard: {
                salesMonthly,
                topProducts,
                customerStats, 
                financialMetrics,
                salesByCategory
            }
        });

    } catch (error) {
        console.error('Dashboard report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;