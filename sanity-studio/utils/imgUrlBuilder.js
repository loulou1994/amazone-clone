import imageUrlBuilder from '@sanity/image-url'
import clientConfig from '../clientConfig'

const builder = imageUrlBuilder(clientConfig)

export default function urlFor(source){
    return builder.image(source)
}