import React from 'react'
import Container from './Container'
import * as styles from './footer.module.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Container as="footer">
      <div className={styles.container}>
        © <a href="https://www.deviantart.com/robbfox">Robb Fox</a> {currentYear}
      </div>
    </Container>
  )
}
export default Footer
