import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import AnimatedStars from './AnimatedStars';
import './bulma/css/bulma.css';
import Typing from './Typing';

const MainContainer = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas>
        <color attach="background" args={['#000117']} />
        <AnimatedStars />
        <OrbitControls />
          <Html position={[0, 0, 0]}>
        <h1 className="title has-text-white has-text-centered">
              <Typing />
          </h1>
          <a href="/">
            <button className="button is-success" style={{position: 'absolute', top: -340, left: -735 }}>Home</button>
          </a>
        
        </Html>
      </Canvas>
    </div>
  );
};

export default MainContainer;
