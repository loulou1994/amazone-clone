import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from '../../styles/productsList.module.css';

import Layout from '../../components/Layout';
import FilterSection from '../../components/FilterSection';

import { client } from '../../utils/queryData';
import generateImgPlaceholder from '../../utils/genImgPlaceholder';

const Category = ({ products }) => {
  const [filterProducts, setFilterProducts] = useState(products);
  const { query } = useRouter();
  
  useEffect(() => {
    if(query.item) {
      setFilterProducts(() =>
        products.filter(
          item => item.name.toUpperCase().search(query.item.toUpperCase()) !== -1
        )
      );
    }
  }, [query]);
  return (
    <>
      <Layout>
        <Head>
          <title>Featured Products</title>
          <meta
            name="description"
            content="products featured in the looked up category"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={`${styles.category} flex`}>
          <FilterSection
            products={products}
            filterProducts={setFilterProducts}
          />
          <section className={styles['products-wrapper']}>
            <h1>RESULTS</h1>
            <div className={`${styles['products-grid']} grid`}>
              {filterProducts.length ? (
                filterProducts.map((product) => {
                  const {
                    _id,
                    name,
                    brand,
                    images: image,
                    description,
                    price,
                    category,
                    discount,
                    slug: { current },
                  } = product;
                  return (
                    <article className={styles.product} key={_id}>
                      <div className={styles.product__image}>
                        <Link href={`${category}/${current}`}>
                          <Image
                            src={image.src}
                            fill
                            sizes='(max-width: 36.25em) 100vw, (max-width: 49.375rem) 50vw, (max-width: 75em) 33vw, 25vw'
                            alt={image.alternativeText}
                            placeholder="blur"
                            blurDataURL={image.blurDataURL}
                          />
                        </Link>
                      </div>
                      <h2 className={styles.product__title}>{name}</h2>
                      <p className={styles.product__description}>
                        {description}
                      </p>
                      <p className={styles.product__brand}>Brand: {brand}</p>
                      <p className={styles.product__price}>
                        <span className={discount && styles['cross-out']}>
                          ${price}
                        </span>
                        {discount && (
                          <span>
                            {' '}
                            - ${Math.floor(((100 - discount) / 100) * price)}
                          </span>
                        )}
                      </p>
                    </article>
                  );
                })
              ) : (
                <p
                  style={{
                    gridColumn: 'span 2',
                  }}
                >
                  No items found using the defined filter options
                </p>
              )}
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const query = `*[_type == "product"]{category}`;
  const paths = await client.fetch(query).then((categories) => {
    const filterCategories = new Set();
    let allPaths = [];

    categories.forEach((product) => {
      filterCategories.add(product.category);
    });
    filterCategories.forEach((category) => {
      allPaths.push({ params: { productCategory: category } });
    });
    return allPaths;
  });
  paths.push({ params: { productCategory: 'All' } });

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}

export async function getStaticProps(context) {
  const { params } = context;
  const query =
    params.productCategory === 'All'
      ? `*[_type == "product" && quantity > 0]`
      : `*[_type == "product" && category == $productCategory && quantity > 0]`;
  const products = await client.fetch(query, params).then(async(productList) => {
    return Promise.all(productList.map(async(product) => {
      return { ...product, images: await generateImgPlaceholder(product.images[0])};
    }))
  });
  return {
    props: { products },
  };
}
export default Category;