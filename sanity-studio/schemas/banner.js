import { defineField, defineType } from "sanity";

export default defineType({
    name: 'banner',
    type: 'document',
    title: 'Banner',
    fields: [
        {
            name: 'image',
            type: 'image',
            title: 'Image',
            validation: Rule => Rule.required(),
            fields: [
                {
                    name: 'alternative',
                    type: 'string',
                    title: 'Alternative text',
                    validation: Rule => Rule.required()
                }
            ]
        },
        {
            name: 'title',
            type: 'string',
            title: 'Title',
            description: 'title of the banner image'
        }
    ]
})