const CartRepositoryImpl = require('../../infrastructure/database/repositories/CartRepositoryImpl');
const ShippingService = require('../../domain/services/ShippingService');

const AddItemToCartUseCase = require('../../application/use-cases/cart/AddItemToCartUseCase');
const GetCartUseCase = require('../../application/use-cases/cart/GetCartUseCase');
const UpdateCartItemQuantityUseCase = require('../../application/use-cases/cart/UpdateCartItemQuantityUseCase');
const RemoveCartItemUseCase = require('../../application/use-cases/cart/RemoveCartItemUseCase');
const CalculateCartShippingUseCase = require('../../application/use-cases/cart/CalculateCartShippingUseCase');

const cartRepository = new CartRepositoryImpl();
const shippingService = new ShippingService();

const addItemToCartUseCase = new AddItemToCartUseCase(cartRepository);
const getCartUseCase = new GetCartUseCase(cartRepository);
const updateCartItemQuantityUseCase = new UpdateCartItemQuantityUseCase(cartRepository);
const removeCartItemUseCase = new RemoveCartItemUseCase(cartRepository);
const calculateCartShippingUseCase = new CalculateCartShippingUseCase(
    cartRepository,
    shippingService
);

const cartHandler = {
    async addItem(req, res) {
        try {
            const cartId = req.user.userId;
            const { productId, quantity } = req.body;

            await addItemToCartUseCase.execute({
                cartId,
                productId,
                quantity
            });

            return res.json({ message: 'Product added to cart successfully' });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async getCart(req, res) {
        try {
            const cartId = req.user.userId;

            const cart = await getCartUseCase.execute({ cartId });

            return res.json(cart);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async updateQuantity(req, res) {
        try {
            const cartId = req.user.userId;
            const { productId, quantity } = req.body;

            await updateCartItemQuantityUseCase.execute({
                cartId,
                productId,
                quantity
            });

            return res.json({ message: 'Cart updated successfully' });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async removeItem(req, res) {
        try {
            const cartId = req.user.userId;
            const { productId } = req.body;

            await removeCartItemUseCase.execute({
                cartId,
                productId
            });

            return res.json({ message: 'Item removed from cart successfully' });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async calculateShipping(req, res) {
        try {
            const cartId = req.user.userId;
            const { shippingMethodId } = req.body;

            const result = await calculateCartShippingUseCase.execute({
                cartId,
                shippingMethodId
            });

            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
};

module.exports = cartHandler;