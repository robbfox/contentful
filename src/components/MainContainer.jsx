import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import AnimatedStars from './AnimatedStars';
import './bulma/css/bulma.css';
import DesktopTyping from './DesktopTyping';
import MediaQuery from 'react-responsive';
import MobileTyping from './MobileTyping';
import Navigation from './navigation';
import './MainContainer_styling.css'


const MainContainer = () => {
 
  return (
    <div style={{ height: '80vh', width: '90vw', margin: 'auto'}}>
      <Canvas>
        <color attach="background" args={['#000117']} />
        <AnimatedStars />
        <OrbitControls />
        <>
  
        <Html  position={[0, 0, 0]}>
        <h1 className="title has-text-white has-text-centered">
              <MediaQuery minWidth={1224}><DesktopTyping /></MediaQuery>
              <MediaQuery maxWidth={1224}><MobileTyping /></MediaQuery>
              </h1>
           </Html>
  </>
      </Canvas>
    </div>
    
  );
};

export default MainContainer;
