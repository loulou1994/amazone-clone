import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
        name: 'email',
        title: 'Email',
        type: 'string',
    }),
    defineField({
        name: 'password',
        title: 'Password',
        type: 'string',
    }),
    defineField({
        name: 'isAdmin',
        title: 'Is Admin',
        type: 'boolean',
    })
  ],
})
