import slugify from "slugify";

export default async function myAsyncSlugifier(input, schemaType, context){
    const slug = slugify(input);
    const { getClient } = context;
    const client = getClient({apiVersion: '2022-12-27'});
    const query = 'count(*[_type=="product" && slug.current match $slug + "*"])'
    const params = {slug: slug}
    const sameSlugCount = await client.fetch(query, params)
    return sameSlugCount !== 0 ? `${slug}-${sameSlugCount}` : slug
}