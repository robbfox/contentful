import React, { useState } from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const Hero = ({ image, experimentalImage, title, content }) => {
  const [isHovered, setIsHovered] = useState(false)

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
        minHeight: '70vh', 
        overflow: 'hidden',
        backgroundColor: '#222',
        WebkitTapHighlightColor: 'transparent', // Stops blue flash
        WebkitTouchCallout: 'none', // Stops iOS menu (backup)
        userSelect: 'none',         // Stops text selection
        WebkitUserSelect: 'none'    // Safari text selection
      }}
      // --- INTERACTION HANDLERS (Keep these on the parent DIV) ---
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onTouchCancel={() => setIsHovered(false)}
      // This blocks the Right-Click menu on Desktop
      onContextMenu={(e) => {
        e.preventDefault()
        return false
      }}
    >
      
      {/* 1. EXPERIMENTAL IMAGE (Background) */}
      {experimentalImage && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <GatsbyImage 
            image={experimentalImage} 
            alt="Experimental View" 
            style={{ height: "100%", width: "100%", pointerEvents: 'none' }} // ADDED HERE
            imgStyle={{ objectFit: "cover" }} 
            draggable={false} // ADDED HERE
          />
        </div>
      )}

      {/* 2. PROFESSIONAL IMAGE (Foreground) */}
      {image ? (
        <div style={{ 
          position: 'relative', 
          zIndex: 2,
          transition: 'opacity 0.4s ease-in-out',
          opacity: isHovered ? 0 : 1,
          height: '100%',
          width: '100%',
          pointerEvents: 'none' // <--- CRITICAL: This makes the image invisible to clicks
        }}>
          <GatsbyImage 
            image={image} 
            alt={title || "Professional View"} 
            loading="eager"
            style={{ height: "100%", minHeight: '70vh' }}
            draggable={false} // Prevents dragging "ghost" image
          />
        </div>
      ) : (
        <div style={{ height: '70vh', width: '100%' }}></div>
      )}

      {/* 3. TEXT CONTENT */}
      <div style={{
        // ... (rest of your text styles) ...
        pointerEvents: 'none', // Keep this!
      }}>
        {/* ... (Your text content) ... */}
      </div>

    </div>
  )
}

export default Hero