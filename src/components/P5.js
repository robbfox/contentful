// P5Overlay.js
import { useEffect } from 'react';
import p5 from 'p5';

const P5Overlay = ({ words }) => {
  useEffect(() => {
    const sketch = (p) => {
      const numWords = words.length;
      let wordIndex = 0;
      let emergeSpeed = 20;
    


      class Word {
        constructor(word) {
          this.x = p.constrain(p.random(p.width), 0, p.width); // Adjust 100 as needed
    // Random y position within the canvas height
          this.y = p.constrain(p.random(p.height), 0, p.height); // Random y position within the canvas height
          this.size = p.random(200, 200);
          this.opacity = 0;
          this.word = word;
          this.displayTime = p.millis(); // Record the time when the word is displayed
          this.fadeDuration = 3000; // 3000 milliseconds (3 seconds) fade duration
        }

        update() {
          const elapsedTime = p.millis() - this.displayTime;
          if (elapsedTime > this.fadeDuration) {
            // If elapsed time exceeds fade duration, remove the word
            wordInstances.splice(wordInstances.indexOf(this), 1);
          } else {
            // Otherwise, update opacity based on elapsed time
            this.opacity = p.map(elapsedTime, 0, this.fadeDuration, 255, 0);
          }

          this.size = p.lerp(this.size, p.random(20, 30), 0.05);
        }

        display() {
          p.textSize(this.size);
          p.fill(255, this.opacity);
          p.text(this.word, this.x, this.y);
        }
      }

      const wordInstances = [];

      p.setup = () => {
        // Adjust the position of the canvas by changing the values in translate
        p.createCanvas(window.innerWidth * 0.9, window.innerHeight * 0.8).style('position', 'absolute').style('top', '10%').style('left', '4.3%').style('pointer-events', 'none');
      };

      p.draw = () => {
        p.clear();

        if (wordIndex < numWords) {
          if (p.frameCount % emergeSpeed === 0) {
            const currentWord = words[wordIndex];

            wordInstances.push(new Word(currentWord));
            wordIndex++;
          }
        }

        for (let i = 0; i < wordInstances.length; i++) {
          wordInstances[i].update();
          wordInstances[i].display();
        }
      };
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, [words]);

  return null;
};

export default P5Overlay;
