import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAppContext } from "../context/appContext";
import imageLoader from "../utils/imageLoader";

import styles from "../styles/ShoppingCart.module.css";
import quantityOptions from "../utils/quantityOptions";

const Checkout = () => {
  const { deleteItem, addToCart, userInfo, cart } = useAppContext();
  const [controlledInputs, setControlledInputs] = useState([]);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false)
  const moreThanOneItem =
  cart.items.length > 1 || cart.items.some((item) => item.quantity > 1);
  let totalCost = cart.items
    .reduce((prevVal, currentVal) => {
      return prevVal + currentVal.price * currentVal.quantity;
    }, 0)
    .toFixed(2);
  
  useEffect(() => {
    if (!isHydrated){
      setIsHydrated(true)
    }
    setControlledInputs(() => cart.items.map(() => 1));
  }, []);

  const selectOnchangeHandler = (value, index) => {
    setControlledInputs((preVal) => {
      const updatedInputs = [...preVal];
      updatedInputs[index] = parseInt(value);
      return updatedInputs;
    });
  };

  const redirectToCheckout = async () => {
    if (!userInfo) router.push("/login");
    else {
      try {
        const response = await fetch("/api/stripe/checkout_session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart, customerId: userInfo._id }),
        });
        const data = await response.json();
        window.location.replace(data.url);
      } catch (err) {
        console.log(`Error ${err.statusCode}: ${err.messge}`);
      }
    }
  };

  if (!isHydrated) {
    return null
  }
  
  return (
    <Layout>
      <Head>
        <title>Shopping Cart</title>
        <meta
          name="description"
          content="All Items added to shopping cart before proceeding to checkout"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles["shoppingCart-main"]} flex`}>
        {cart.items.length ? (
          <>
            <section className={`${styles["cart-items-wrapper"]}`}>
              <h1>Shopping Cart</h1>
              <p>Price</p>
              <div className={`${styles["gridItems-container"]} flex`}>
                {cart.items.map((item, index) => {
                  const { id, name, price, image, maxQty } = item;
                  return (
                    <article className={`${styles.item} grid`} key={id}>
                      <p className={styles.item__title}>{name}</p>
                      <div className={`${styles.item__img}`}>
                        <Image
                          loader={imageLoader}
                          src={image.src}
                          fill
                          sizes="(min-width: 700) 25vw,
                          40vw"
                          alt={image.alternativeText}
                          placeholder="blur"
                          blurDataURL={image.blurDataURL}
                        />
                      </div>
                      <div className={`${styles.item__infos}`}>
                        <p>In Stock</p>
                        <div className={`${styles["edit-item-wrapper"]} flex`}>
                          <label htmlFor="quantity">
                            <span className="sr-only">
                              select quantity to add to cart
                            </span>
                            <span>Qty: {controlledInputs[index]}</span>
                            <select
                              id="quantity"
                              onChange={(e) => {
                                selectOnchangeHandler(e.target.value, index);
                                addToCart(item, parseInt(e.target.value));
                              }}
                              value={controlledInputs[index]}
                              className="select-options"
                            >
                              {quantityOptions(maxQty).map((qty, index) => {
                                return (
                                  <option value={qty} key={index}>
                                    {qty}
                                  </option>
                                );
                              })}
                            </select>
                          </label>
                          <span className={`${styles["space-bar"]}`}></span>
                          <button
                            className={`${styles["delete-btn"]} pointer`}
                            onClick={() => {
                              deleteItem(id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <span className={`${styles.item__price}`}>
                        ${price.toFixed(2)}
                      </span>
                    </article>
                  );
                })}
              </div>
              <p className={`${styles["total-price"]}`}>
                Subtotal(
                {cart.items.reduce((prevVal, currentVal) => {
                  return prevVal + currentVal.quantity;
                }, 0)}{" "}
                {moreThanOneItem ? "items" : "item"}): <span>${totalCost}</span>
              </p>
            </section>
            <section className={`${styles["checkout-link-wrapper"]}`}>
              <p className={`${styles["total-price"]}`}>
                Subtotal(
                {cart.items.reduce((prevVal, currentVal) => {
                  return prevVal + currentVal.quantity;
                }, 0)}{" "}
                {moreThanOneItem ? "items" : "item"}): <span>${totalCost}</span>
              </p>
              <button className="pointer" onClick={redirectToCheckout}>
                Proceed to Checkout
              </button> 
            </section>
          </>
        ) : (
          <div className={`${styles["empty-cart-wrapper"]}`}>
            <div className={`${styles["empty-cart-img"]}`}>
              <Image
                src="/images/empty-cart.svg"
                fill
                sizes="(max-width: 1440px) 20vw"
                alt="empty cart image"
                priority
              />
            </div>
            <h1 className={`${styles["empty-cart-title"]}`}>
              Your Shopping Cart is Empty
            </h1>
            <p className={`${styles["empty-cart-text"]}`}>
              Please checkout our various products split into different{" "}
              <Link href="/">categories</Link>
            </p>
          </div>
        )}
      </main>
    </Layout>
  );
};
export default Checkout