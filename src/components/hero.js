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

  // Define the style object for the internal images once to reuse it
  // This is the "Nuclear" layer that applies directly to the <img> tag
  const noTouchImageStyle = {
    objectFit: "cover",
    pointerEvents: 'none',       // Invisible to mouse/touch
    userSelect: 'none',          // Cannot be highlighted
    WebkitUserSelect: 'none',    // Safari specific
    WebkitTouchCallout: 'none'   // iOS Safari/Chrome specific block
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
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        // NEW: This tells the browser "Allow vertical scrolling, but handle taps manually"
        // This is crucial for preventing default Chrome gestures
        touchAction: 'pan-y' 
      }}
      // --- INTERACTION HANDLERS ---
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onTouchCancel={() => setIsHovered(false)}
      // Force block context menu
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        return false
      }}
    >
      
      {/* 1. EXPERIMENTAL IMAGE (Background) */}
      {experimentalImage && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
          <GatsbyImage 
            image={experimentalImage} 
            alt="Experimental View" 
            style={{ height: "100%", width: "100%", pointerEvents: 'none' }} 
            // APPLYING THE FIX DIRECTLY TO THE INNER IMAGE
            imgStyle={noTouchImageStyle} 
            draggable={false} 
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
          pointerEvents: 'none' 
        }}>
          <GatsbyImage 
            image={image} 
            alt={title || "Professional View"} 
            loading="eager"
            style={{ height: "100%", minHeight: '70vh' }}
            // APPLYING THE FIX DIRECTLY TO THE INNER IMAGE
            imgStyle={noTouchImageStyle} 
            draggable={false} 
          />
        </div>
      ) : (
        <div style={{ height: '70vh', width: '100%' }}></div>
      )}

      {/* 3. TEXT CONTENT */}
      <div style={{
        position: 'absolute',
        top: '65%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        textAlign: 'center',
        pointerEvents: 'none', 
        width: '90%',
        maxWidth: '900px'
      }}>
        {/* ... Title and Bio ... */}
        <h1 style={{ 
          color: '#EAFF04', 
          fontSize: '4.5rem', 
          marginBottom: '0.5rem', 
          fontWeight: '800',
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
          textShadow: `
            0 2px 0px #000,
            0 4px 10px rgba(0,0,0,0.5),
            0 0 60px rgba(0,0,0,0.9)
          `
        }}>
          {title}
        </h1>
        
        {content && (
           <div style={{ 
             marginTop: '1.2rem',
             display: 'inline-block',
             backgroundColor: '#111', 
             color: 'white',
             fontFamily: '"Courier New", Courier, monospace', 
             fontSize: '1.3rem',
             fontWeight: 'bold',
             padding: '0.5rem 1.5rem', 
             border: '2px solid #EAFF04', 
             boxShadow: '6px 6px 0px rgba(0,0,0,0.5)', 
             transform: 'rotate(-1deg)', 
             maxWidth: '90%' 
           }}>
             {renderBio()}
           </div>
        )}
      </div>

    </div>
  )
}

export default Hero