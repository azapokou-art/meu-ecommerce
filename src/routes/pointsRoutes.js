const express = require('express');
const router = express.Router();
const UserPoints = require('../models/UserPoints');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const balance = await UserPoints.getBalance(userId);

        res.json({
            success: true,
            balance: balance
        });

    } catch (error) {
        console.error('Get points balance error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/history', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const history = await UserPoints.getHistory(userId);

        res.json({
            success: true,
            history: history
        });

    } catch (error) {
        console.error('Get points history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/redeem', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { pointsToRedeem } = req.body;

        if (!pointsToRedeem || pointsToRedeem <= 0) {
            return res.status(400).json({ error: 'Pontos inválidos para resgate' });
        }

        const balance = await UserPoints.getBalance(userId);

        if (pointsToRedeem > balance) {
            return res.status(400).json({ error: 'Saldo de pontos insuficiente' });
        }

       
        const discountValue = pointsToRedeem / 100;

       
        await UserPoints.addPoints(
            userId, 
            pointsToRedeem, 
            'redeemed', 
            `Resgate de ${pointsToRedeem} pontos por desconto de R$ ${discountValue.toFixed(2)}`
        );

        res.json({
            success: true,
            message: `Pontos resgatados com sucesso! Desconto: R$ ${discountValue.toFixed(2)}`,
            discountValue: discountValue,
            pointsRedeemed: pointsToRedeem,
            newBalance: balance - pointsToRedeem
        });

    } catch (error) {
        console.error('Redeem points error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;