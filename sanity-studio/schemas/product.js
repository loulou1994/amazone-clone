import {defineType, defineField} from 'sanity'
import slugifier from '../utils/slugifier'

export default defineType({
  name: 'product',
  type: 'document',
  title: 'Product',
  fields: [
    defineField({
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [
        {
          type: 'image',
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
            {
              name: 'alternativeText',
              type: 'string',
              title: 'Alternative text',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brand',
      type: 'string',
      title: 'Brand',
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      initialValue: 'Phones',
      options: {
        list: [
          {
            title: 'phones',
            value: 'Phones',
          },
          {
            title: 'laptops',
            value: 'Laptops',
          },
          {
            title: 'desktops',
            value: 'Desktops',
          },
          {
            title: 'tablets',
            value: 'Tablets',
          },
          {
            title: 'game Consoles',
            value: 'Game-Consoles',
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      type: 'number',
      title: 'Price',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quantity',
      type: 'number',
      title: 'Quantity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'discount',
      type: 'number',
      title: 'Discount',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'Set a URL for this product. Preferably, the name of the product',
      options: {
        source: 'name',
        slugify: slugifier,
      },
    }),
  ],
})
