import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei'; // OrbitControls removed
import { navigate } from 'gatsby';
import * as THREE from 'three';

// PostPanel component (remains the same)
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, currentY);
    return currentY + lineHeight; // Return Y position after last line
}


function BakedPanelTexture({
    imageUrl,
    title,
    date,
    panelWidthPx = 600, // Total width of the texture
    panelHeightPx = 500, // Total height of the texture
    imagePortion = 0.95, // Image takes top 75% of height
    textBgColor = '#333333', // Background color for the text area
    textColor = 'white',
    titleFontSize = 30,
    dateFontSize = 24,
    fontFamily = 'Arial'
}) {
    const [texture, setTexture] = useState(null);
    const baseImage = useLoader(THREE.TextureLoader, imageUrl);

    useEffect(() => {
        if (!baseImage || !baseImage.image) { // Ensure baseImage.image is loaded
            console.log("Base image not ready or not an image element");
            return;
        }
        // Ensure the image element has actually loaded its data
        if (!baseImage.image.complete || baseImage.image.naturalHeight === 0) {
            const img = baseImage.image;
            const onImageLoad = () => {
                console.log("Base image fully loaded, proceeding with baking.");
                bakeTexture();
                img.removeEventListener('load', onImageLoad);
                img.removeEventListener('error', onImageError);
            };
            const onImageError = () => {
                console.error("Error loading base image for baking.");
                img.removeEventListener('load', onImageLoad);
                img.removeEventListener('error', onImageError);
            };
            img.addEventListener('load', onImageLoad);
            img.addEventListener('error', onImageError);
            if (img.src && img.complete) { // If already complete (e.g. from cache)
                bakeTexture();
            }
            return; // Wait for image to load
        }

        bakeTexture(); // Bake if image already loaded and complete

        function bakeTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = panelWidthPx;
            canvas.height = panelHeightPx;
            const ctx = canvas.getContext('2d');

            const imageHeight = panelHeightPx * imagePortion;
            const textAreastartY = imageHeight;
            const textAreaHeight = panelHeightPx - imageHeight;
            const padding = 15; // Padding within the text area

            // 1. Draw base image in its designated area
            try {
                ctx.drawImage(baseImage.image, 0, 0, panelWidthPx, imageHeight);
            } catch (e) {
                console.error("Error drawing image to canvas:", e, baseImage.image);
                // Draw a fallback color if image draw fails
                ctx.fillStyle = '#555';
                ctx.fillRect(0, 0, panelWidthPx, imageHeight);
            }


            // 2. Draw background for the text area
            ctx.fillStyle = textBgColor;
            ctx.fillRect(0, textAreastartY, panelWidthPx, textAreaHeight);

            // 3. Draw text within the text area
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';

            // Title
            ctx.font = `bold ${titleFontSize}px ${fontFamily}`;
            // Simple word wrapping for title (you might need a more robust solution)
            let currentTextY = textAreastartY + padding + titleFontSize; // Start Y for title
            currentTextY = wrapText(ctx, title, panelWidthPx / 2, currentTextY, panelWidthPx - (padding * 2), titleFontSize * 1.2);


            // Date
            if (date) {
                ctx.font = `${dateFontSize}px ${fontFamily}`;
                // currentTextY is already advanced by wrapText, add a little space
                currentTextY += dateFontSize * 0.5; // Small space before date
                wrapText(ctx, date, panelWidthPx / 2, currentTextY, panelWidthPx - (padding*2), dateFontSize * 1.2);
            }

            const newTexture = new THREE.CanvasTexture(canvas);
            newTexture.needsUpdate = true;
            setTexture(newTexture);

            return () => {
                newTexture.dispose();
            };
        }

    }, [baseImage, title, date, panelWidthPx, panelHeightPx, imagePortion, textBgColor, textColor, titleFontSize, dateFontSize, fontFamily]);

    return texture;
}

// Then in PostPanel:
function PostPanel({ post, position, rotationY }) {
  const fallbackImage = '/fallback-image.jpg'; // Make sure this exists in your /static folder
  const imageUrl = post?.heroImage?.gatsbyImage?.images?.fallback?.src || fallbackImage;
  const titleText = post?.title || 'Untitled';
  const dateText = post?.publishDate;

  const bakedTexture = BakedPanelTexture({
    imageUrl: imageUrl,
    title: titleText,
    date: dateText,
    panelWidthPx: 600, // Texture width
    panelHeightPx: 400, // Texture height (e.g. 3:2 aspect)
    imagePortion: 0.7,  // Image takes 70% of height, text area 30%
    textBgColor: '#282c34', // Dark background for text
    textColor: '#ffffff',
    titleFontSize: 28,
    dateFontSize: 20,
    fontFamily: 'sans-serif' // Choose a common font or ensure webfont is loaded
  });

  const [isHovered, setIsHovered] = useState(false);
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(
        groupRef.current.scale.x,
        isHovered ? 1.1 : 1,
        0.1
      ));
    }
  });

  if (!bakedTexture) {
    // Optional: Render a placeholder or null while texture is baking
    // This helps prevent errors if bakedTexture is initially null.
    // You could return a simple <mesh><boxGeometry /></mesh> or similar.
    return (
        <mesh position={position} rotation-y={rotationY}>
            <planeGeometry args={[3,2]} />
            <meshBasicMaterial color="grey" wireframe />
        </mesh>
    );
  }

  return (
    <group
      ref={groupRef}
      position={position}
      rotation-y={rotationY}
      onClick={() => post?.slug && navigate(`/blog/${post.slug}`)}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Front Plane */}
      <mesh position-z={0.001}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial map={bakedTexture} />
      </mesh>
      {/* Back Plane */}
      <mesh rotation-y={Math.PI} position-z={-0.001}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial map={bakedTexture} />
      </mesh>
    </group>
  );
}

// GalleryScene component (remains the same)
function GalleryScene({ panelPositions, targetRotation }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {panelPositions.map(({ post, position, rotationY }, index) => (
        <PostPanel
          key={post?.slug || index}
          post={post}
          position={position}
          rotationY={rotationY}
        />
      ))}
    </group>
  );
}


const BlogGallery3D = ({ posts = [], autoRotateSpeed = 0.003 }) => {
  const lastTouchY = useRef(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const userInteractionRotationSpeed = 0.002;
  const radius = 5;

  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const interactionTimeoutRef = useRef(null); // For resuming auto-rotation

  // Auto-rotation logic
  useEffect(() => {
    let animationFrameId;
    // Only pause if user is actively interacting (scroll/touch), not on general hover
    if (!isUserInteracting && posts.length > 0) {
      const rotate = () => {
        setTargetRotation((prev) => prev + autoRotateSpeed);
        animationFrameId = requestAnimationFrame(rotate);
      };
      animationFrameId = requestAnimationFrame(rotate);
    }
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isUserInteracting, autoRotateSpeed, posts.length]); // Removed isHoveringCanvas

  // Handle user scroll/touch interaction
  useEffect(() => {
    const markUserInteracting = () => {
      setIsUserInteracting(true);
      clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = setTimeout(() => {
        setIsUserInteracting(false);
      }, 2000); // Resume auto-rotate after 2 seconds of inactivity
    };

    const handleScroll = (event) => {
      markUserInteracting();
      const delta = event.deltaY;
      setTargetRotation((prev) => prev + delta * userInteractionRotationSpeed);
    };

    const handleTouchStart = (event) => {
      if (event.touches.length === 1) {
        markUserInteracting();
        lastTouchY.current = event.touches[0].clientY;
      }
    };

    const handleTouchMove = (event) => {
      if (event.touches.length === 1) {
        const currentTouchY = event.touches[0].clientY;
        const deltaY = currentTouchY - lastTouchY.current;
        setTargetRotation((prev) => prev - deltaY * userInteractionRotationSpeed * 0.5);
        lastTouchY.current = currentTouchY;
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(interactionTimeoutRef.current);
    };
  }, [userInteractionRotationSpeed]);

  const panelPositions = useMemo(() => {
    if (posts.length === 0) return [];
    return posts.map((post, index) => {
      const angle = (index / posts.length) * Math.PI * 2;
      return {
        position: [radius * Math.sin(angle), 0, radius * Math.cos(angle)],
        rotationY: -angle,
        post,
      };
    });
  }, [posts, radius]);

  return (
    // Removed onMouseEnter/onMouseLeave from this div
    <div style={{ height: '80vh', width: '100%', touchAction: 'none', cursor: 'grab' }}>
      <Canvas shadows camera={{ position: [0, 0, radius + 3], fov: 60 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <GalleryScene
          panelPositions={panelPositions}
          targetRotation={targetRotation}
        />
      </Canvas>
    </div>
  );
};

export default BlogGallery3D;