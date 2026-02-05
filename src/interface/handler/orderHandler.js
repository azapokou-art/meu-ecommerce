const OrderRepositoryImpl = require('../../infrastructure/database/repositories/OrderRepositoryImpl');
const CartRepositoryImpl = require('../../infrastructure/database/repositories/CartRepositoryImpl');
const UserPointsRepositoryImpl = require('../../infrastructure/database/repositories/UserPointsRepositoryImpl');
const StockMonitorService = require('../../infrastructure/services/StockMonitorService');

const CreateOrderUseCase = require('../../application/use-cases/order/CreateOrderUseCase');
const GetUserOrdersUseCase = require('../../application/use-cases/order/GetUserOrdersUseCase');
const GetOrderByIdUseCase = require('../../application/use-cases/order/GetOrderByIdUseCase');

const orderRepository = new OrderRepositoryImpl();
const cartRepository = new CartRepositoryImpl();
const userPointsRepository = new UserPointsRepositoryImpl();
const stockMonitorService = new StockMonitorService();

const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    cartRepository,
    userPointsRepository,
    stockMonitorService
);

const getUserOrdersUseCase = new GetUserOrdersUseCase(orderRepository);
const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);

const orderHandler = {

    async createOrder(req, res) {
        try {
            const result = await createOrderUseCase.execute({
                userId: req.user.userId,
                paymentMethod: req.body.paymentMethod,
                shippingAddress: req.body.shippingAddress
            });

            return res.status(201).json({
                message: 'Order created successfully',
                orderId: result.orderId,
                totalAmount: result.totalAmount.toFixed(2)
            });

        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    async getUserOrders(req, res) {
        try {
            const orders = await getUserOrdersUseCase.execute({
                userId: req.user.userId
            });

            return res.json({
                message: 'Orders retrieved successfully',
                orders,
                count: orders.length
            });

        } catch (error) {
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    async getOrderById(req, res) {
        try {
            const order = await getOrderByIdUseCase.execute({
                orderId: req.params.orderId,
                userId: req.user.userId
            });

            return res.json({
                message: 'Order retrieved successfully',
                order
            });

        } catch (error) {
            if (error.message === 'Order not found') {
                return res.status(404).json({ error: error.message });
            }

            if (error.message === 'Access denied') {
                return res.status(403).json({ error: error.message });
            }

            return res.status(400).json({
                error: error.message
            });
        }
    }

};

module.exports = orderHandler;