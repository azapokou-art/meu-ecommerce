const express = require('express');
const router = express.Router();
const CorreiosService = require('../services/correiosService');


router.post('/calculate', async (req, res) => {
    try {
        const { cepDestino, itens } = req.body;

      
        if (!cepDestino || cepDestino.replace(/\D/g, '').length !== 8) {
            return res.status(400).json({ 
                error: 'CEP inválido. Digite um CEP com 8 dígitos.' 
            });
        }

    
        const dimensoes = calcularDimensoesPedido(itens);

     
        const fretes = await CorreiosService.calcularFrete(
            cepDestino,
            dimensoes.peso,
            dimensoes.comprimento,
            dimensoes.altura,
            dimensoes.largura,
            dimensoes.valorTotal
        );

        res.json({
            success: true,
            cepDestino,
            fretes
        });

    } catch (error) {
        console.error('Erro cálculo frete:', error);
        res.status(500).json({ 
            error: 'Erro ao calcular fretes. Tente novamente.' 
        });
    }
});


function calcularDimensoesPedido(itens) {
 
    return {
        peso: itens.reduce((total, item) => total + (item.peso || 0.5), 0),
        comprimento: 30,
        altura: 10, 
        largura: 20,
        valorTotal: itens.reduce((total, item) => total + (item.preco * item.quantidade), 0)
    };
}

module.exports = router;