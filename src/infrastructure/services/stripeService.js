require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripeService = {
    async createCheckoutSession(orderData) {
        try {
            const { orderId, amount, customerEmail, successUrl, cancelUrl } = orderData;


            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'brl',
                            product_data: {
                                name: `Pedido #${orderId}`,
                                description: 'Compra na Loja E-commerce'
                            },
                            unit_amount: Math.round(amount * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: cancelUrl,
                customer_email: customerEmail,
                metadata: {
                    order_id: orderId.toString()
                }
            });

            return session;
        } catch (error) {
            console.error('Stripe checkout session error:', error);
            throw new Error('Erro ao criar sessão de pagamento');
        }
    },

    async retrieveCheckoutSession(sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            return session;
        } catch (error) {
            console.error('Stripe retrieve session error:', error);
            throw new Error('Erro ao verificar sessão de pagamento');
        }
    },

   
    async handleWebhook(payload, signature) {
        console.log('💰 [SIMULAÇÃO] Webhook recebido - pagamento aprovado');
        return {
            success: true,
            orderId: '1',
            paymentStatus: 'paid'
        };
    }
};

module.exports = stripeService;