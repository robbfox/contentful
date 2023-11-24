import React from 'react'

import Container from './container'
import * as styles from './footer.module.css'

const Footer = () => (
  <Container as="footer">
    <div className={styles.container}>
    © <a href="https://www.rfoxy.com/">Robb Fox</a> 2023{' '}
      </a>
    </div>
  </Container>
)

export default Footer
