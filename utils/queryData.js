import sanityClient from '@sanity/client';
import clientConfig from '../sanity-studio/clientConfig'

export const client = sanityClient(clientConfig);