import lqip from 'lqip-modern';
import { normalizeSanityUrl } from './imageLoader';

const generateImgPlaceholder = async (src) => {
  const url = normalizeSanityUrl(src);
  
  const imgData = await fetch(url);
  const arrayBufferData = await imgData.arrayBuffer();
  const lqipData = await lqip(Buffer.from(arrayBufferData));
  
  return {
    src: url.href,
    width: lqipData.metadata.originalWidth,
    height: lqipData.metadata.originalHeight,
    alternativeText: src.alternative || src.alternativeText,
    blurDataURL: lqipData.metadata.dataURIBase64,
  };
};
export default generateImgPlaceholder;