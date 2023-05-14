import urlFor from '../sanity-studio/utils/imgUrlBuilder';

export const normalizeSanityUrl = (src) => {
  const url = urlFor(src).url();
  return new URL(url);
};

const imageLoader = ({ src, width, quality }) => {
  const url = normalizeSanityUrl(src);
  const params = url.searchParams;

  params.set('auto', params.getAll('auto').join(',') || 'format');
  params.set('fit', params.get('fit') || 'max');
  params.set('w', params.get('w') || width.toString());

  if(quality) params.set('q', quality.toString());

  return url;
};
export default imageLoader;