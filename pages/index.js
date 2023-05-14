import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '../context/appContext';

import { client } from '../utils/queryData';
import setGridSize from '../utils/homeCardGridSize';
import urlFor from '../sanity-studio/utils/imgUrlBuilder';

import Layout from '../components/Layout';
import styles from '../styles/home.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import imageLoader from '../utils/imageLoader';
import generateImgPlaceholder from '../utils/genImgPlaceholder';

export default function Home({ categories, banners }) {
  const { userInfo, cart, setCart } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gridHeight, setGridHeight] = useState();

  useEffect(() => {
    updateGridHeight();
    window.addEventListener('resize', updateGridHeight);
    return () => {
      window.removeEventListener('resize', updateGridHeight);
    };
  }, []);

  useEffect(() => {
    async function fetchLatestOrder() {    
      const orderIsMade = await client.fetch(
        `*[_type == "order" && orderId == $orderId][0]`,
        { orderId: cart.preOrderId }
      );
      if (orderIsMade) {
        setCart("cart", { preOrderId: null, items: [] });
        Cookies.set('cart', { preOrderId: null, items: [] });
      }
    }
    if (userInfo && cart.preOrderId) {
      fetchLatestOrder();
    }
  }, []);

  const updateGridHeight = () => {
    setGridHeight(setGridSize(categories.length));
  };

  const positionSlide = (currentSlidePos, slideIndex, slidesLength) => {
    let slidePosition = 'next-slide';
    if (
      (slideIndex === slidesLength - 1 && currentSlide === 0) ||
      currentSlidePos - 1 == slideIndex
    ) {
      slidePosition = 'prev-slide';
    }
    if (currentSlide === slideIndex) {
      slidePosition = 'current-slide';
    }
    return slidePosition;
  };

  const incrementSlide = () => {
    setCurrentSlide((prevValue) => {
      const updatedValue = prevValue + 1;
      if (updatedValue > banners.length - 1) return 0;
      return updatedValue;
    });
  };
  
  const decrementSlide = () => {
    setCurrentSlide((prevValue) => {
      const updatedValue = prevValue - 1;
      if (updatedValue < 0) return banners.length - 1;
      return updatedValue;
    });
  };

  return (
    <Layout>
      <Head>
        <title>Amazon Clone Home</title>
        <meta name="description" content="Amazon clone landing page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.home}>
        <div className={styles['home__hero']}>
          {banners.map((banner, index) => {
            const slidePos = positionSlide(currentSlide, index, banners.length);
            return (
              <div key={banner._id} className={styles[slidePos]}>
                <Image
                  loader={imageLoader}
                  src={banner.image.src}
                  fill
                  alt={banner.image.alternativeText}
                  placeholder='blur'
                  blurDataURL={banner.image.blurDataURL}
                />
              </div>
            );
          })}
          <button
            className={`${styles['hero-btns']} ${styles['left-btn']} pointer`}
            onClick={decrementSlide}
          >
            <FaChevronLeft />
          </button>
          <button
            className={`${styles['hero-btns']} ${styles['right-btn']} pointer`}
            onClick={incrementSlide}
          >
            <FaChevronRight />
          </button>
        </div>
        <div
          className={styles.home__categories}
          style={{ minHeight: gridHeight }}
        >
          {categories.map((category) => {
            const {
              category: productCategory,
              _id,
              images,
            } = category;
            return (
              <article key={_id} className={styles.card}>
                <h2>{productCategory}</h2>
                <div>
                  <Image
                    src={urlFor(images.src).url()}
                    fill
                    sizes='(max-width: 36.25em) 100vw, (max-width: 49.375rem) 50vw, (max-width: 75em) 33vw, 25vw'
                    alt={images.alternativeText}
                    placeholder="blur"
                    blurDataURL={images.blurDataURL}
                  />
                </div>
                <Link href={`Category/${productCategory}`}>Shop Now</Link>
              </article>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
export async function getStaticProps() {
  const queryCategory = '*[_type == "product"]{category, images[0], _id, slug}';
  const categories = await client.fetch(queryCategory).then(async(productList) => {
    let filteredCats = [];
    for (let i=0; i < productList.length; ++i){
      const isAdded = filteredCats.some(
        (product) => product.category === productList[i].category
      );
      if (!isAdded) {
        const addProductCategory = {
          ...productList[i],
          images: await generateImgPlaceholder(productList[i].images),
        };
        filteredCats.push(addProductCategory);
      }
    }
    return filteredCats
  })
  const queryBanner = '*[_type == "banner"]';
  const banners = await client.fetch(queryBanner).then(async (bannersList) => {
    return await Promise.all(
      bannersList.map(async (banner) => {
        return { ...banner, image: await generateImgPlaceholder(banner.image) };
      })
    );
  });;
  return {
    props: { categories, banners },
  };
}