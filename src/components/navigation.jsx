import React from 'react';
import { Link } from 'gatsby';

import * as styles from './navigation.module.css';

const Navigation = ({ theme, toggleTheme }) => (
  <nav role="navigation" className={styles.container} aria-label="Main">
    <ul className={styles.navigation}>
      <li className={styles.navigationItem}>
        <Link to="/" activeClassName="active">
          Home
        </Link>
      </li>
      <li className={styles.navigationItem}>
        <Link to="/blog/1" activeClassName="active">
          Blog
        </Link>
      </li>
      <li className={styles.navigationItem}>
        <Link to="/about/" activeClassName="active">
          About
        </Link>
      </li>
      <li className={styles.navigationItem}>
        <Link to="/contact/" activeClassName="active">
          Contact
        </Link>
      </li>
      <li className={styles.navigationItem}>
        <button onClick={toggleTheme} className={styles.themeToggleButton}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </li>
    </ul>
  </nav>
);

export default Navigation;
