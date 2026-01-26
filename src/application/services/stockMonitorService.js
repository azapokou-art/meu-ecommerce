const Product = require('../models/Product');
const StockAlert = require('../models/StockAlert');

class StockMonitorService {
   
    static async checkStockLevels() {
        try {
            const products = await Product.findAll();
            const alertsGenerated = [];

            for (const product of products) {
                
                const minStockLevel = Math.max(5, Math.floor(product.stock_quantity * 0.1));
                
                if (product.stock_quantity <= minStockLevel) {
                    
                    const hasPendingAlert = await StockAlert.hasPendingAlert(product.id);
                    
                    if (!hasPendingAlert) {
                        const alertMessage = `Estoque baixo: ${product.name} tem apenas ${product.stock_quantity} unidades (mínimo: ${minStockLevel})`;
                        
                        await StockAlert.createAlert(
                            product.id,
                            product.stock_quantity,
                            minStockLevel,
                            alertMessage
                        );
                        
                        alertsGenerated.push({
                            product: product.name,
                            currentStock: product.stock_quantity,
                            minStock: minStockLevel
                        });
                    }
                }
            }

            return {
                checked: products.length,
                alertsGenerated: alertsGenerated.length,
                details: alertsGenerated
            };

        } catch (error) {
            console.error('Stock check error:', error);
            throw error;
        }
    }

    static async checkProductStockAfterSale(productId, quantitySold) {
        try {
            const product = await Product.findById(productId);
            
            if (!product) return;

            const minStockLevel = Math.max(5, Math.floor(product.stock_quantity * 0.1));
            const newStock = product.stock_quantity - quantitySold;
            
        
            if (newStock <= minStockLevel) {
                const hasPendingAlert = await StockAlert.hasPendingAlert(productId);
                
                if (!hasPendingAlert) {
                    const alertMessage = `Estoque crítico após venda: ${product.name} tem apenas ${newStock} unidades (mínimo: ${minStockLevel})`;
                    
                    await StockAlert.createAlert(
                        productId,
                        newStock,
                        minStockLevel,
                        alertMessage
                    );
                }
            }

        } catch (error) {
            console.error('Post-sale stock check error:', error);
        }
    }
}

module.exports = StockMonitorService;