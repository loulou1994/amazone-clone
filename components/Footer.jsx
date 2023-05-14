import React from 'react'
import styles from '../styles/footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a href="#top" className={`${styles['footer__back-top']} pointer`}>
        Back to top
      </a>
      <section className={`${styles.footer__navigation_section} flex`}>
        <div>
          <h3>Get to know us</h3>
          <ul>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Blogs</a>
            </li>
            <li>
              <a href="#">About Amazon</a>
            </li>
            <li>
              <a href="#">Amazon device</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Make money with us</h3>
          <ul>
            <li>
              <a href="#">Sell products on amazon</a>
            </li>
            <li>
              <a href="#">sell on Amazon Business</a>
            </li>
            <li>
              <a href="#">Sell apps on Amazon</a>
            </li>
            <li>
              <a href="#">Become an affiliate</a>
            </li>
            <li>
              <a href="#">Host an Amazon hub</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Amazon payment products</h3>
          <ul>
            <li>
              <a href="#">Amazon business card</a>
            </li>
            <li>
              <a href="#">Shop with points</a>
            </li>
            <li>
              <a href="#">Reload your balance</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Let us help you</h3>
          <ul>
            <li>
              <a href="#">Your account</a>
            </li>
            <li>
              <a href="#">Your orders</a>
            </li>
          </ul>
        </div>
      </section>
    </footer>
  );
}
export default Footer