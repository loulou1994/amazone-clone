import axios from 'axios';

import clientConfig from '../sanity-studio/clientConfig';

export default async function mutatingSanityContent(transactionsArray) {
  const projectId = clientConfig.projectId;
  const dataset = clientConfig.dataset;
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  try {
    const { data } = await axios.post(
      `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
      { mutations: transactionsArray },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${tokenWithWriteAccess}`,
        },
      }
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(`${err.statusCode}: ${err.message}`);
  }
}