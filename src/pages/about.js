import React from 'react'
import MainContainer from '../components/MainContainer'
import Layout from '../components/layout'
import { motion } from 'framer-motion'
class AboutIndex extends React.Component {
  render() {
     return (
      <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5 }}>
   <Layout>
    <MainContainer />
    </Layout>
    </motion.div>
 )
  } 
}
export default AboutIndex