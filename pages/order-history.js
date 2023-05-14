import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import axios from 'axios';

import { useAppContext } from '../context/appContext';
import getError from '../utils/getErrors';

import Layout from '../components/Layout';
import Loading from '../components/Loading';

import styles from '../styles/orderHistory.module.css';
import emptyList from '../public/images/empty-list-icon.svg';

const Order = () => {
  const { userInfo } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [listOfOrders, setLisOfOrders] = useState([]);
  let orderedProducts = []

  useEffect(() => {
    async function getOrders() {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/orders/fetch-order', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setLisOfOrders(data);
      } catch (error) {
        getError(error);
      }
      setLoading(false);
    }
    if (userInfo) {
      getOrders();
    }
  }, [userInfo]);

  // function 
  return (
    <Layout>
      <Head>
        <title>Your Orders</title>
        <meta
          name="description"
          content="The items's order history the user made from the website"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles['order-history-main']}`}>
        {loading ? (
          <Loading />
        ) : !listOfOrders.length ? (
          <div className={`${styles['empty-container']} flex`}>
            <Image src={emptyList} alt="Empty list" />
            <h1>Empty List</h1>
            <p>You have no ongoing order at the moment.</p>
          </div>
        ) : (
          <>
            <h1 className={`${styles["order-history__title"]}`}>Order History</h1>
            <table className={`${styles["order-history__table"]}`}>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">DATE</th>
                  <th scope="col">Total</th>
                  <th scope="col">PAID</th>
                  <th scope="col">DELIVERED</th>
                </tr>
              </thead>
              <tbody>
                {listOfOrders.forEach(order => {
                  const {orderId, createdAt, products} = order;
                  orderedProducts = products.map(product => {
                    const {_key, price, quantity} = product
                    return (
                      <tr key={_key}>
                      <td data-label="ID">{orderId}</td>
                      <td data-label="DATE">{createdAt}</td>
                      <td data-label="TOTAL">${quantity * ((price / 100).toFixed(2))}</td>
                      <td data-label="PAID">Paid</td>
                      <td data-label="DELIVERED">Not yet</td>
                    </tr>
                    )
                  })
                })}
                {orderedProducts}
              </tbody>
            </table>
          </>
        )}
      </main>
    </Layout>
  );
};
export default Order;