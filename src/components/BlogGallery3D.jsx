import React, { useRef, useState, useEffect, useMemo } from 'react'; // useEffect is used in BlogGallery3D & BakedPanelTexture
import { Canvas, useFrame, useLoader } from '@react-three/fiber'; // useLoader is needed here
import { Text } from '@react-three/drei'; // Text is not directly used in BakedPanelTexture, but PostPanel uses it if you revert
import { navigate } from 'gatsby';
import * as THREE from 'three';

// Constants for BakedPanelTexture
const DEFAULT_PANEL_WIDTH_PX = 600;
const DEFAULT_PANEL_HEIGHT_PX = 400; // Adjusted to maintain 3:2 aspect ratio with default plane
const DEFAULT_IMAGE_PORTION = 0.7;  // Defaulting to the value used in PostPanel
const DEFAULT_TEXT_BG_COLOR = '#282c34';// Defaulting to the value used in PostPanel
const DEFAULT_TEXT_COLOR = 'white';
const DEFAULT_TITLE_FONT_SIZE = 28;   // Defaulting to the value used in PostPanel
const DEFAULT_DATE_FONT_SIZE = 20;    // Defaulting to the value used in PostPanel
const DEFAULT_FONT_FAMILY = 'sans-serif'; // Defaulting to the value used in PostPanel
const TEXTURE_PADDING = 15;

// Constants for BlogGallery3D (kept separate for clarity, could be merged if preferred)
// const GALLERY_RADIUS = 5; // Already defined in BlogGallery3D
const USER_INTERACTION_TIMEOUT = 2000; // Already defined in BlogGallery3D
const DEFAULT_CAMERA_FOV = 60; // Already defined in BlogGallery3D

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
    return currentY + lineHeight;
}

function BakedPanelTexture({
    imageUrl,
    title,
    date,
    panelWidthPx = DEFAULT_PANEL_WIDTH_PX,
    panelHeightPx = DEFAULT_PANEL_HEIGHT_PX,
    imagePortion = DEFAULT_IMAGE_PORTION,
    textBgColor = DEFAULT_TEXT_BG_COLOR,
    textColor = DEFAULT_TEXT_COLOR,
    titleFontSize = DEFAULT_TITLE_FONT_SIZE,
    dateFontSize = DEFAULT_DATE_FONT_SIZE,
    fontFamily = DEFAULT_FONT_FAMILY
}) { // This is the correct opening brace for the function body
    const [texture, setTexture] = useState(null);
    // baseImage should be declared ONCE here
    const baseImage = useLoader(THREE.TextureLoader, imageUrl);

    useEffect(() => {
        if (!baseImage || !baseImage.image) {
            // console.log("Base image not ready or not an image element (yet)");
            return; // Wait for baseImage and baseImage.image to be available
        }

        let didUnmount = false; // To prevent state updates on unmounted component

        const performBake = () => {
            // Ensure the image element has actually loaded its data
            if (!baseImage.image.complete || baseImage.image.naturalHeight === 0) {
                const img = baseImage.image;
                const onImageLoad = () => {
                    // console.log("Base image fully loaded, proceeding with baking.");
                    if (!didUnmount) bakeTexture();
                    img.removeEventListener('load', onImageLoad);
                    img.removeEventListener('error', onImageError);
                };
                const onImageError = (e) => {
                    console.error("Error loading base image for baking:", e, img.src);
                    img.removeEventListener('load', onImageLoad);
                    img.removeEventListener('error', onImageError);
                    // Optionally set a fallback texture or error state here
                };

                // Check if already errored or loaded before adding listeners
                if (img.complete && img.naturalHeight !== 0) {
                     if (!didUnmount) bakeTexture();
                } else if (img.complete && img.naturalHeight === 0 && img.src) { // Complete but no height usually means error
                    console.error("Image " + img.src + " completed with 0 height, likely an error.");
                } else if (img.src) { // Only add listeners if src is set and not yet fully loaded/errored
                    img.addEventListener('load', onImageLoad);
                    img.addEventListener('error', onImageError);
                } else {
                    // console.log("Image src not available yet for listeners.");
                }
                return; // Wait for image to load via event listener
            }
            // Bake if image already loaded and complete
            if (!didUnmount) bakeTexture();
        };

        function bakeTexture() {
            // console.log("Baking texture for:", title);
            const canvas = document.createElement('canvas');
            canvas.width = panelWidthPx;
            canvas.height = panelHeightPx;
            const ctx = canvas.getContext('2d');

            const imageHeight = panelHeightPx * imagePortion;
            const textAreastartY = imageHeight;
            const textAreaHeight = panelHeightPx - imageHeight;
            const padding = TEXTURE_PADDING;

            try {
                ctx.drawImage(baseImage.image, 0, 0, panelWidthPx, imageHeight);
            } catch (e) {
                console.error("Error drawing image to canvas:", e, baseImage.image.src);
                ctx.fillStyle = '#555'; // Fallback color
                ctx.fillRect(0, 0, panelWidthPx, imageHeight);
            }

            ctx.fillStyle = textBgColor;
            ctx.fillRect(0, textAreastartY, panelWidthPx, textAreaHeight);

            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';

            ctx.font = `bold ${titleFontSize}px ${fontFamily}`;
            let currentTextY = textAreastartY + padding + titleFontSize;
            currentTextY = wrapText(ctx, title, panelWidthPx / 2, currentTextY, panelWidthPx - (padding * 2), titleFontSize * 1.2);

            if (date) {
                ctx.font = `${dateFontSize}px ${fontFamily}`;
                currentTextY += dateFontSize * 0.5;
                wrapText(ctx, date, panelWidthPx / 2, currentTextY, panelWidthPx - (padding * 2), dateFontSize * 1.2);
            }

            const newTexture = new THREE.CanvasTexture(canvas);
            newTexture.needsUpdate = true;
            if (!didUnmount) {
                setTexture(newTexture);
            } else {
                newTexture.dispose(); // Dispose if component unmounted before texture was set
            }
        }
        
        performBake(); // Call the bake initiation logic

        return () => {
            didUnmount = true;
            // The texture set in state will be disposed by R3F/Three.js when no longer used by a material.
            // If you created a texture that wasn't set in state for some reason, dispose here.
            // console.log("BakedPanelTexture unmounting for:", title);
        };

    }, [baseImage, title, date, panelWidthPx, panelHeightPx, imagePortion, textBgColor, textColor, titleFontSize, dateFontSize, fontFamily]);

    return texture;
}


// PostPanel:
function PostPanel({ post, position, rotationY }) {
  const fallbackImage = '/fallback-image.jpg';
  const imageUrl = post?.heroImage?.gatsbyImage?.images?.fallback?.src || fallbackImage;
  const titleText = post?.title || 'Untitled';
  const dateText = post?.publishDate;

  const bakedTexture = BakedPanelTexture({
    imageUrl: imageUrl,
    title: titleText,
    date: dateText,
    // Using constants for clarity and consistency
    panelWidthPx: DEFAULT_PANEL_WIDTH_PX,
    panelHeightPx: DEFAULT_PANEL_HEIGHT_PX,
    imagePortion: DEFAULT_IMAGE_PORTION,
    textBgColor: DEFAULT_TEXT_BG_COLOR,
    textColor: DEFAULT_TEXT_COLOR,
    titleFontSize: DEFAULT_TITLE_FONT_SIZE,
    dateFontSize: DEFAULT_DATE_FONT_SIZE,
    fontFamily: DEFAULT_FONT_FAMILY
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
    return (
      <mesh position={position} rotation-y={rotationY}>
        <planeGeometry args={[3, 2]} />
        {/* Keep fallback simple, avoid loading more textures here */}
        <meshBasicMaterial color="#444444" wireframe={false} />
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
      <mesh position-z={0.001}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial map={bakedTexture} transparent={bakedTexture?.transparent} />
      </mesh>
      <mesh rotation-y={Math.PI} position-z={-0.001}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial map={bakedTexture} transparent={bakedTexture?.transparent} />
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

// BlogGallery3D component
const BlogGallery3D = ({ posts = [], autoRotateSpeed = 0.002 }) => { // Adjusted default autoRotateSpeed
  const lastTouchY = useRef(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const userInteractionRotationSpeed = 0.003;
  // const radius = GALLERY_RADIUS; // Using local const for clarity
  const radius = 5; // Or define GALLERY_RADIUS here or import

  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const interactionTimeoutRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
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
  }, [isUserInteracting, autoRotateSpeed, posts.length]);

  useEffect(() => {
    const markUserInteracting = () => {
      setIsUserInteracting(true);
      clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = setTimeout(() => {
        setIsUserInteracting(false);
      }, USER_INTERACTION_TIMEOUT); // Using constant
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
  }, [userInteractionRotationSpeed]); // Removed autoRotateSpeed from here

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
    <div style={{ height: '80vh', width: '100%', touchAction: 'none', cursor: 'grab' }}>
      <Canvas 
        shadows 
        camera={{ 
            position: [0, 0, radius + 3], 
            fov: DEFAULT_CAMERA_FOV, // Using constant
            near: 0.1, 
            far: 100 // Adjusted far clipping plane slightly for potentially better depth precision
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        {/* Removed Suspense as bakedTexture handles its own loading state before rendering */}
        <GalleryScene
          panelPositions={panelPositions}
          targetRotation={targetRotation}
        />
      </Canvas>
    </div>
  );
};

export default BlogGallery3D;