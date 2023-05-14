import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'

import { useAppContext } from '../context/appContext';
// stylesheet
import styles from '../styles/header.module.css';
// icons & images
import { MdArrowDropDown } from 'react-icons/md';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import logo from '../public/images/logo.svg';
import { ImExit } from 'react-icons/im';

const Header = () => {
  const router = useRouter();
  const [controlledInputs, setSelectedValue] = useState({
    category: 'All',
    item: '',
  });
  const { userInfo, setUserInfo, cart } = useAppContext();
  const [queryStrIsFetched, setQueryStrIsFetched] = useState(false);

  const itemsInCart = cart.items.length ? cart.items.reduce(
    (prevVal, currVal) => prevVal + currVal.quantity
  , 0) : 0;
  const [isHydrated, setIsHydrated] = useState(false)

  // handling hydration mismatch between SSR & CSR
  useEffect(() => {
    !isHydrated && setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (router.query.item && controlledInputs.item !== router.query.item) {
      setSelectedValue((prevVal) => ({ ...prevVal, item: router.query.item }));
    }
    setQueryStrIsFetched(false);
  }, [router.query]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (controlledInputs.item !== router.query.item ||
        controlledInputs.category !== router.query.productCategory) &&
      !queryStrIsFetched
    ) {
      router.push({
        pathname: `/Category/${controlledInputs.category}`,
        query: { item: controlledInputs.item },
      });
      setQueryStrIsFetched(() => true);
    }
  };
  const updateControlledInputs = (e) => {
    setSelectedValue((prevVal) => ({
      ...prevVal,
      [e.target.name]: e.target.value,
    }));
  };
  const logoutHandler = () => {
    setUserInfo(null)
    Cookies.remove('userInfo');
    router.push('/');
  };

  // render blank HTML when on SSR
  if (!isHydrated){
    return null
  }

  return (
    <>
      <a href="#top"></a>
      <Link href="/" className={styles['skip-link']}>
        Skip to main content
      </Link>
      <header className={`${styles.header} flex outer-spacing`}>
        <Link href="/" className={styles.header__logo}>
          <Image src={logo} alt="logo"/>
        </Link>
        <form
          onSubmit={handleSubmit}
          className={`${styles.header__form} flex`}
          role="search"
        >
          <div className="select-container">
            <div className="flex">
              <span className="current-value">{controlledInputs.category}</span>
              <MdArrowDropDown />
            </div>
            <select
              name="category"
              value={controlledInputs.category}
              onChange={updateControlledInputs}
              className="select-options"
            >
              <option value="All">All</option>
              <option value="Phones">Phones</option>
              <option value="Laptops">Laptops</option>
              <option value="Desktops">Desktop PC</option>
              <option value="Tablets">Tablets</option>
              <option value="Game-Consoles">Game Consoles</option>
            </select>
          </div>
          <input
            type="text"
            name="item"
            id="search-item"
            value={controlledInputs.item}
            onChange={updateControlledInputs}
          />
          <button type="submit" className="pointer">
            <FiSearch />
          </button>
        </form>
        <div className={`${styles['header__user-details']} flex`}>
          <div className={`${styles['user-info']} flex`}>
            {userInfo ? (              
              <>
                <Link href={'/profile'}>{userInfo.name}</Link>
                <button
                  onClick={logoutHandler}
                  className={`${styles['logout-btn']} pointer`}
                >
                  <ImExit />
                </button>
              </>
            ) : (
              <>
                <span className="sml-txt">Hello, guest</span>
                <Link href="/login">Sign In</Link>
              </>
            )}
          </div>
          <Link
            href={`${userInfo ? '/order-history' : '/login'}`}
            className={`${styles['orders-info']} flex`}
          >
            <span className="sml-txt">Returns</span>
            <span>& Orders</span>
          </Link>
          <Link
            href="/shoppingCart"
            className={`${styles['shopping-cart']} flex`}
          >
            <FiShoppingCart />
            <span className="sml-txt">
              {itemsInCart}
            </span>
            <span>Cart</span>
          </Link>
        </div>
      </header>
    </>
  );
};
export default Header;