import React, { useContext, useState } from "react";
import Cookies from 'js-cookie'
import { v4 as uuidv4 } from "uuid";

const AppContext = React.createContext(null)
const userData = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")) : null
const cartDetails =  Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) :  {
  preOrderId: null,
  items: [],
}

const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(cartDetails);
  const [userInfo, setUserInfo] = useState(userData);
  
  const deleteItem = (itemId) => {
    setCart((prevVal) => {
      const updatedCart = {...prevVal, items: cart.items.filter(item => item.id !== itemId)}
      Cookies.set("cart", JSON.stringify(updatedCart))
      return updatedCart
    })
  };

  const addToCart = (item, quantity) => {
    let updatedCart = [];
    let cartId = cart.preOrderId;
    if (!cartId) {
      cartId = uuidv4();
    }
    const itemInCart = cart.items.filter(
      (product) => product.name === item.name
    );
    if (!itemInCart.length) {
      const newlyAddedItemCart = [
        ...cart.items,
        {
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: quantity,
          image: item.images[0],
          maxQty: item.quantity,
        },
      ];
      updatedCart = { preOrderId: cartId, items: newlyAddedItemCart };
    } else {
      const updatedItemCart = cart.items.map((product) => {
        if (product.name === item.name) {
          return { ...product, quantity: quantity };
        }
        return product;
      });
      updatedCart = { preOrderId: cartId, items: updatedItemCart };
    }
    setCart(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart))
  };

  return (
    <AppContext.Provider
      value={{ addToCart, deleteItem, cart, setCart, userInfo, setUserInfo }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { useAppContext, AppProvider };