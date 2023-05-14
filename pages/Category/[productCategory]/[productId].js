import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppContext } from '../../../context/appContext';

import styles from '../../../styles/productPage.module.css';
import { IoIosArrowForward } from 'react-icons/io';
import { FiChevronDown } from 'react-icons/fi';

import Layout from '../../../components/Layout';

import generateImgPlaceholder from '../../../utils/genImgPlaceholder';
import imageLoader from '../../../utils/imageLoader';
import { client } from '../../../utils/queryData';
import quantityOptions from '../../../utils/quantityOptions';

const Product = ({ product }) => {
  const [qtyInput, setQtyInput] = useState(1);
  const [mainImage, setMainImage] = useState(0)
  const {query} = useRouter();
  const { addToCart } = useAppContext();
  
  return (
    <>
      <Layout>
        <Head>
          <title>{product[0].name}</title>
          <meta
            name="description"
            content="All about the selected product outlining its features and pricing"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={`${styles['product-main']}`}>
          <div className={`${styles['previous-page']} flex`}>
            <Link href={`/Category/${query.productCategory}`}>
              {query.productCategory}
            </Link>
            <IoIosArrowForward />
            <Link
              href={`/Category/${query.productCategory}/${query.productId}`}
            >
              {query.productId}
            </Link>
          </div>
          {product.map((data) => {
            const { images, price, brand, description, discount, name, _id } =
              data;
            return (
              <div className={`${styles['product-wrapper']} flex`} key={_id}>
                <article className={`${styles['product-article']} flex`}>
                  <div className={`${styles['images-container']} flex`}>
                    <div className={`${styles['images-container__mainImage']}`}>
                      <Image
                        loader={imageLoader}
                        src={images[mainImage].src}
                        fill
                        sizes='(max-width: 64em) 87.5wv,
                        37.8vw'
                        alt={images[mainImage].alternativeText}
                        placeholder="blur"
                        blurDataURL={images[mainImage].blurDataURL}
                      />
                    </div>
                    <div
                      className={`${styles['images-container__thumbnails']} flex`}
                    >
                      {images.map((image, index) => {
                        return (
                          <div
                            className={`${styles.thumbnail} pointer`}
                            key={index}
                            onMouseOver={() => {
                              setMainImage(index);
                            }}
                          >
                            <Image
                              loader={imageLoader}
                              src={image.src}
                              fill
                              sizes="(max-width: 64em) 19vw,
                              5.6wv"
                              alt={image.alternativeText}
                              placeholder="blur"
                              blurDataURL={image.blurDataURL}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className={`${styles.product}`}>
                    <div className={`${styles.product__title}`}>
                      <h1>{name}</h1>
                      <p className={styles.product__brand}>
                        <span>Brand</span>: {brand}
                      </p>
                    </div>
                    <div className={`${styles.product__pricing}`}>
                      {discount ? (
                        <>
                          <p>
                            List Price: <span>${price.toFixed(2)}</span>
                          </p>
                          <p>
                            Price:{' '}
                            <span>
                              ${(price - (discount / 100) * price).toFixed(2)}
                            </span>
                          </p>
                          <p>
                            You Save:{' '}
                            <span>
                              ${((discount / 100) * price).toFixed(2)} (
                              {discount}
                              %)
                            </span>
                          </p>
                        </>
                      ) : (
                        <p>Price: ${price.toFixed(2)}</p>
                      )}
                    </div>
                    <div className={`${styles.product__description}`}>
                      <p>About this item</p>
                      <p>{description}</p>
                    </div>
                  </div>
                </article>
                <section className={`${styles['cart-side']} flex`}>
                  <p className={`${styles['cart-price']}`}>
                    <sup>$</sup>
                    <span>
                      {discount
                        ? Math.floor(price - (discount / 100) * price)
                        : Math.floor(price)}
                    </span>
                    <sup>
                      {discount
                        ? (price - (discount / 100) * price)
                            .toFixed(2)
                            .slice(-2)
                        : price.toFixed(2).slice(-2)}
                    </sup>
                  </p>
                  <p>In Stock.</p>
                  <label
                    htmlFor="quantity"
                    className={`${styles['quantity-label']} flex`}
                    tabIndex="0"
                  >
                    <span className="sr-only ">
                      select quantity to add to cart
                    </span>
                    <span className={`${styles['select-input']}`}>
                      Qty: {qtyInput}{' '}
                    </span>
                    <FiChevronDown />
                    <select
                      id="quantity"
                      value={qtyInput}
                      onChange={(e) => {
                        setQtyInput(e.target.value);
                      }}
                      className="select-options"
                    >
                      {quantityOptions(product[0].quantity).map(
                        (quantity, index) => {
                          return (
                            <option value={quantity} key={index}>
                              {quantity}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </label>
                  <button
                    className={`${styles['add-to-cart-btn']} pointer`}
                    onClick={() => {
                      addToCart(product[0], parseInt(qtyInput));
                    }}
                  >
                    Add to Cart
                  </button>
                  <button className={`${styles['buy-now-btn']} pointer`}>
                    Buy Now
                  </button>
                </section>
              </div>
            );
          })}
        </main>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const query = `*[_type == "product"]{name, category, slug}`;
  const allPaths = await client.fetch(query).then((products) => {
    const paths = [];
    products.forEach((product) => {
      paths.push({
        params: {
          productId: product.slug.current,
          productCategory: product.category,
        },
      });
    });
    return paths;
  });
  return {
    paths: allPaths,
    fallback: false, // can also be true or 'blocking'
  };
}
export async function getStaticProps(context) {
  const { params } = context;
  const query = `*[_type == "product" && slug.current == $productId && quantity > 0]`;
  const product = await client.fetch(query, params).then(async productList => {
    return await Promise.all(productList.map(async product => {
      const imagesData = await Promise.all(product.images.map(async image => {
        return await generateImgPlaceholder(image)
      }))
      return {...product, images: imagesData}
    }))
  });
  return {
    props: { product },
  };
}

export default Product;