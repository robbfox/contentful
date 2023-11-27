// Typing.js
import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import txt from 'raw-loader!./typed-text.txt';
import './DesktopTyping.css'; // Import the CSS file with styles

function DesktopTyping() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [txt],
      typeSpeed: 25,
      backSpeed: 5,
      showCursor: false,
      cursorChar: '|', // Set the cursor character
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="typing-container">
      <span ref={el} className="desktop-typing-text" />
    </div>
  );
}

export default DesktopTyping;
