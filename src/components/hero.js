import React, { useState } from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const Hero = ({ image, experimentalImage, title, content }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Helper to safely render rich text
  const renderBio = () => {
    if (!content || !content.raw) return null
    try {
      return documentToReactComponents(JSON.parse(content.raw))
    } catch (e) {
      console.error("Error parsing bio:", e)
      return null
    }
  }

  return (
    <div 
      className="hero-container"
      style={{ 
        position: 'relative', 
        width: '100%', 
        minHeight: '60vh', 
        overflow: 'hidden',
        backgroundColor: '#222' // Dark gray fallback
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* 1. EXPERIMENTAL IMAGE (Absolute Background - Hidden Layer) */}
      {experimentalImage && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 1 
        }}>
          <GatsbyImage 
            image={experimentalImage} 
            alt="Experimental View" 
            style={{ height: "100%", width: "100%" }}
            imgStyle={{ objectFit: "cover" }} 
          />
        </div>
      )}

      {/* 2. PROFESSIONAL IMAGE (Relative - Top Layer) */}
      {image ? (
        <div style={{ 
          position: 'relative', 
          zIndex: 2,
          transition: 'opacity 0.4s ease-in-out',
          opacity: isHovered ? 0 : 1,
          height: '100%',
          width: '100%'
        }}>
          <GatsbyImage 
            image={image} 
            alt={title || "Professional View"} 
            loading="eager"
            style={{ height: "100%", minHeight: '60vh' }}
          />
        </div>
      ) : (
        // Fallback empty div to keep structure if main image fails
        <div style={{ height: '60vh', width: '100%' }}></div>
      )}

      {/* 3. TEXT CONTENT (Overlay) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        color: 'white',
        textAlign: 'center',
        pointerEvents: 'none',
        width: '80%',
        maxWidth: '800px'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem', 
          fontWeight: '700',
          textShadow: '0 2px 20px rgba(0,0,0,0.8)' 
        }}>
          {title}
        </h1>
        
        {content && (
           <div style={{ 
             fontSize: '1.25rem',
             textShadow: '0 1px 10px rgba(0,0,0,0.9)',
             lineHeight: '1.6'
           }}>
             {renderBio()}
           </div>
        )}
      </div>

    </div>
  )
}

export default Hero