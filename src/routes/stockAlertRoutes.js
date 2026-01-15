const express = require('express');
const router = express.Router();
const StockAlert = require('../models/StockAlert');
const StockMonitorService = require('../services/StockMonitorService');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/pending', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const alerts = await StockAlert.getPendingAlerts();

        res.json({
            success: true,
            alerts: alerts,
            count: alerts.length
        });

    } catch (error) {
        console.error('Get pending alerts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/resolve/:alertId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { alertId } = req.params;
        const resolvedBy = req.user.userId;

        const resolved = await StockAlert.resolveAlert(alertId, resolvedBy);

        if (!resolved) {
            return res.status(404).json({ error: 'Alerta não encontrado ou já resolvido' });
        }

        res.json({
            success: true,
            message: 'Alerta resolvido com sucesso'
        });

    } catch (error) {
        console.error('Resolve alert error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/check-stock', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const result = await StockMonitorService.checkStockLevels();

        res.json({
            success: true,
            message: `Verificação concluída: ${result.checked} produtos verificados, ${result.alertsGenerated} alertas gerados`,
            ...result
        });

    } catch (error) {
        console.error('Manual stock check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/history', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const history = await StockAlert.getAlertHistory();

        res.json({
            success: true,
            history: history
        });

    } catch (error) {
        console.error('Get alert history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;