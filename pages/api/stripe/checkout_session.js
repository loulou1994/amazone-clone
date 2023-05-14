import nc from 'next-connect';
import dollarToCentConverter from '../../../utils/usToCentsConverter';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const handler = nc();

export default handler.post(async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.cart.items.map((item) => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: [item.image.src],
              metadata: {
                orderId: req.body.cart.preOrderId,
                customerId: req.body.customerId,
                productId: item.id
              }
            },
            unit_amount: dollarToCentConverter(item.price),
          },
          quantity: item.quantity,
        };
      }),
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["DZ", "US"]
      },
      mode: 'payment',
      success_url: `${req.headers.origin}/`,
      cancel_url: `${req.headers.origin}/shoppingCart`,
      submit_type: 'pay',
    });        
    res.status(200).json(session)
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
});