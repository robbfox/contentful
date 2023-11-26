import React from 'react'
import { Stars } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const AnimatedStars = () => {
    const StarsRef = useRef()
    useFrame(() => {
        StarsRef.current.rotation.x += 0.0001
        StarsRef.current.rotation.y += 0.0001
        StarsRef.current.rotation.z += 0.0001
    
    })
return <Stars ref={StarsRef} />
}

export default AnimatedStars
