import React from 'react'
import Container from './Container'
import * as styles from './footer.module.css'

const Footer = () => (
  <Container as="footer">
    <div className={styles.container}>
    © <a href="https://www.deviantart.com/robbfox">Robb Fox</a> 2025{' '}
    </div>
  </Container>
)

export default Footer
