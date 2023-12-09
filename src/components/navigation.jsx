import React from 'react'
import { Link } from 'gatsby'

import * as styles from './navigation.module.css'

const Navigation = () => (
  <nav role="navigation" className={styles.container} aria-label="Main">
    <ul className={styles.navigation}>
      <li className={styles.navigationItem}>
        <div onclick="">
        <Link to="/" activeClassName="active">
          Home
        </Link>
        </div>
      </li>
      <li className={styles.navigationItem}>
        <div onclick="">
        <Link to="/blog/" activeClassName="active">
          Blog
        </Link>
        </div>
      </li>
      <li className={styles.navigationItem}>
        <div onclick="">
        <Link to="/about/" activeClassName="active">
          About
        </Link>
        </div>
      </li>
    </ul>
  </nav>
)

export default Navigation
