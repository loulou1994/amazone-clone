import React, { useState } from 'react';

import styles from '../styles/filteringComp.module.css';
import { FiChevronDown } from 'react-icons/fi';

const FilterSection = ({ products, filterProducts }) => {
  const [controlledInputs, setControlledInputs] = useState({
    selectInput: 'Featured',
    minValueInput: '',
    maxValueInput: '',
  });

  const PRICES = {
    UNDER_200: [0, 199.9],
    UPTO_250: [200, 250],
    UPTO_300: [250, 300],
    ABOVE_300: [300, Number.MAX_VALUE],
  };

  const updateControlledInputs = (e) => {
    setControlledInputs((prevValue) => {
      if (e.target.id === 'min-value')
        return { ...prevValue, minValueInput: e.target.value };
      else if (e.target.id === 'max-value')
        return { ...prevValue, maxValueInput: e.target.value };
      else return {
        ...prevValue,
        selectInput: e.target.value,
      };
    });
  };

  const filteringByPrice = (min, max) => {
    return products.filter((product) => min <= product.price && product.price <= max);
  };

  const filteringBySelectOptions = (option) => {
    let copyProducts = structuredClone(products);
    if(option === "ascending") {
      copyProducts.sort((a, b) => a.price - b.price);
    }
    else if(option === "descending") {
      copyProducts.sort((a, b) => b.price - a.price);
    }
    else if(option === "newest") {
      copyProducts.sort((a, b) => {
        const firstDate = a._createdAt.slice(0, 10).replace(/-/g, '');
        const secondDate = b._createdAt.slice(0, 10).replace(/-/g, '');
        return parseInt(secondDate) - parseInt(firstDate);
      });
    }else copyProducts = products;

    return copyProducts
  };

  const filteringByDiscounts = () => {
    return products.filter(product => product.discount)
  };

  return (
    <div className={styles.filter}>
      <div className={styles.filter__pricing}>
        <p>Price</p>
        <ul className="flex">
          <li>
            <button
              onClick={() => {
                filterProducts(filteringByPrice(...PRICES.UNDER_200));
              }}
              className="pointer"
            >
              Under $200
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                filterProducts(filteringByPrice(...PRICES.UPTO_250))
              }
              className="pointer"
            >
              $200 to $250
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                filterProducts(filteringByPrice(...PRICES.UPTO_300))
              }
              className="pointer"
            >
              $250 to $300
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                filterProducts(filteringByPrice(...PRICES.ABOVE_300))
              }
              className="pointer"
            >
              $300 & Above
            </button>
          </li>
        </ul>
        <div className={`${styles['price-range-container']} flex`}>
          <label htmlFor="min-value">
            <span>$</span>
            <span className="sr-only">minimum value</span>
            <input
              type="text"
              id="min-value"
              value={controlledInputs.minValueInput}
              onChange={updateControlledInputs}
              placeholder="Min"
            />
          </label>
          <label htmlFor="max-value">
            <span>$</span>
            <span className="sr-only">maximum value</span>
            <input
              type="text"
              id="max-value"
              value={controlledInputs.maxValueInput}
              onChange={updateControlledInputs}
              placeholder="Max"
            />
          </label>
          <button
            onClick={() => {
              filterProducts(
                filteringByPrice(
                  parseInt(controlledInputs.minValueInput),
                  parseInt(controlledInputs.maxValueInput)
                )
              );
            }}
            className="pointer"
          >
            Go
          </button>
        </div>
      </div>
      <div className={styles.filter__sorting}>
        <p className="flex">
          <span>Sort by: {controlledInputs.selectInput}</span>
          <FiChevronDown />
        </p>
        <select
          onChange={(e) => {
            updateControlledInputs(e);
            filterProducts(
              filteringBySelectOptions(e.target.selectedOptions[0].id)
            );
          }}
          value={controlledInputs.selectInput}
          className="select-options"
        >
          <option value="Featured" id="all">
            Featured
          </option>
          <option value="Price: Low to High" id="ascending">
            Price: Low to High
          </option>
          <option value="Price: High to Low" id="descending">
            Price: High to Low
          </option>
          <option value="Newest Arrivals" id="newest">
            Newest Arrivals
          </option>
        </select>
      </div>
      <button
        onClick={() => {
          filterProducts(filteringByDiscounts());
        }}
        className={`${styles.filter__discounts} pointer`}
      >
        Dicounts Only
      </button>
    </div>
  );
};
export default FilterSection;