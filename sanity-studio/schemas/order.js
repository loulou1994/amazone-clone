import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'order',
  type: 'document',
  title: 'Order',
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order N°',
      type: 'string',
    }),
    defineField({
      name: 'user',
      title: 'Username',
      type: 'reference',
      to: [
        {
          type: 'user',
        },
      ],
      description: 'The customer who made the order',
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        {
          title: 'Product Info',
          type: 'object',
          fields: [
            {
              title: 'Product',
              name: 'product',
              type: 'reference',
              weak: true,
              to: [{type: 'product'}],
            },
            {
              title: "Price",
              name: "price",
              type: 'number',
            },
            {
              name: 'quantity',
              title: 'Qty',
              type: 'number',
            },
          ],
        },
      ],
    }),
    
    defineField({
      name: 'address',
      title: 'Shipping Address',
      type: 'string',
    }),

    defineField({
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
    }),

    defineField({
      name: 'isDelivered',
      title: 'Order Delivered',
      type: 'boolean',
      initialValue: false,
    }),
    
    defineField({
      name: 'deliveredAt',
      title: 'Delivered At',
      type: 'datetime',
    }),
  ],
})
