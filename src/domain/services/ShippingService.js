class ShippingService {
    calculate({ items, shippingMethod }) {
        if (!items || items.length === 0) {
            throw new Error('Cart is empty');
        }

        if (!shippingMethod) {
            throw new Error('Shipping method not found');
        }

        const itemsSubtotal = items.reduce((sum, item) => {
            return sum + Number(item.subtotal);
        }, 0);

        const shippingPrice = Number(shippingMethod.price);

        const total = itemsSubtotal + shippingPrice;

        return {
            itemsSubtotal,
            shipping: {
                id: shippingMethod.id,
                name: shippingMethod.name,
                price: shippingPrice
            },
            total
        };
    }
}

module.exports = ShippingService;