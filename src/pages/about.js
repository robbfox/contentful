import React from 'react';
import Layout from '../components/layout';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import AnimatedStars from '../components/AnimatedStars';
import '../components/global.css'
import MediaQuery from 'react-responsive';
import '../components/MainContainer_styling.css';
import ReactTyped from 'react-typed-component';
import { graphql } from 'gatsby';
import { get } from 'lodash';
import '../components/typing.css';
import 'bulma/css/bulma.min.css';





// ... (other imports)

const AboutIndex = ({ data }) => {
   const stuff = get(data, 'allContentfulPerson.nodes[0].about.raw', '');
   const parsedStuff = JSON.parse(stuff);
   const textContent = parsedStuff.content[0].content[0].value;
 
   return (
     <Layout>
         <div style={{ height: '80vh', width: '90vw', margin: 'auto' }}>
           <Canvas>
             <color attach="background" args={['#000117']} />
             <AnimatedStars />
             <OrbitControls />
             <>
               <Html position={[-6, 1, 0]}>
                 <MediaQuery minWidth={1224}>
                   <h1 className="title has-text-white has-text-centered">
                     <div
                       className="desktoptyping-container desktop-typing-text"
                       style={{ display: 'inline-block' }}
                     >
                       <ReactTyped
                         strings={[textContent]}
                         typeSpeed={40}
                         backspeed={60}
                         loop
                       />
                     </div>
                   </h1>
                 </MediaQuery>
                 <MediaQuery maxWidth={1224}>
                   <h1 className="title has-text-white has-text-centered">
                   <div
                       className="mobile-typing-container mobile-typing-text"
                       style={{ display: 'inline-block' }}
                     >
                       
                       <ReactTyped
                         strings={[textContent]}
                         typeSpeed={40}
                         backspeed={60}
                         loop
                       />
                     </div>
                   </h1>
                 </MediaQuery>
               </Html>
             </>
           </Canvas>
         </div>
       </Layout>
 );
};
 
 export default AboutIndex;
 
 // ... (remaining code)
 

export const pageQuery = graphql`
  query HomeQuery {
    allContentfulPerson(
      filter: { contentful_id: { eq: "15jwOBqpxqSAOy2eOO4S0m" } }
    ) {
      nodes {
        about {
          raw
        }
      }
    }
  }
`;
