import nc from 'next-connect';
import { v4 as uuidv4 } from 'uuid';

import { client } from '../../../utils/queryData';
import mutatingSanityContent from '../../../utils/sanityDocMutation';

const handler = nc();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecrect =
  'whsec_43d416c6f8b2fe8a0f32dea2fea5e1141175ccfa0f46651e7c3bca7535b01ddd';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default handler.post(async (req, res) => {
  console.log(typeof client, typeof mutatingSanityContent)
  res.send({received: true})
  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');
  let event = rawBody;

  if (endpointSecrect) {
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecrect
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }
  switch (event.type) {
    case 'checkout.session.completed':
      const lineItems = await stripe.checkout.sessions.listLineItems(
        event.data.object.id,
        { expand: ['data.price.product'] }
      );
      const paymentIntent = await stripe.paymentIntents.retrieve(
        event.data.object.payment_intent,
        { expand: ['payment_method'] }
      );
      const {
        billing_details: { address },
      } = paymentIntent.payment_method;
      const date = new Date(
        paymentIntent.payment_method.created * 1000
      ).toISOString();
      
      const mutateQtyProducts = [];
      for (let i = 0; i < lineItems.data.length; ++i) {
        const { quantity } = lineItems.data[i];
        const { productId } = lineItems.data[i].price.product.metadata;
        mutateQtyProducts.push({
          patch: { id: productId, dec: { quantity: quantity } },
        });
      }
      //using for loop to perform asynchronous operation inside every item
      //the array iteration methods(map, forEach, reduce, ...etc) aren't async aware.
      const mutateOrderDoc = [];
      let newOrderId = null;
      const { customerId, orderId } = lineItems.data[0].price.product.metadata;
      const { country, city, line1, line2 } = address;
      for (let j = 0; j < lineItems.data.length; ++j) {
        const {
          quantity,
          price: {
            product: {
              metadata: { productId },
            },
          },
          price: {
            unit_amount
          }
        } = lineItems.data[j];
        const orderIsCreated = await client.fetch(
          `*[_type == "order" && orderId == $orderId][0]`,
          { orderId }
        );
        if (!orderIsCreated) {
          const newOrder = [
            {
              create: {
                _type: 'order',
                orderId: orderId,
                user: {
                  _type: 'reference',
                  _ref: customerId,
                },
                products: [
                  {
                    _key: uuidv4(),
                    product: {
                      _type: 'reference',
                      _ref: productId,
                      _weak: true,
                    },
                    price: unit_amount,
                    quantity: quantity,
                  },
                ],
                address: `${line1} ${line2} ${city} ${country}`,
                createdAt: date,
              },
            },
          ];
          newOrderId = await mutatingSanityContent(newOrder);
        } else {
          mutateOrderDoc.push({
            patch: {
              id: newOrderId.results[0].id,
              insert: {
                after: 'products[-1]',
                items: [
                  {
                    _key: uuidv4(),
                    product: {
                      _type: 'reference',
                      _ref: productId,
                      _weak: true,
                    },
                    price: unit_amount,
                    quantity: quantity,
                  },
                ],
              },
            },
          });
        }
      }
      await mutatingSanityContent(mutateOrderDoc.concat(mutateQtyProducts));
      break;
    default:
      return null;
  }
  res.send({ received: true });
});