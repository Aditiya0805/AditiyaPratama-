import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = -100;
    let mouseY = -100;
    let posX = -100;
    let posY = -100;
    let animFrameId = null;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    const renderFollower = () => {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;
      follower.style.left = `${posX}px`;
      follower.style.top = `${posY}px`;
      animFrameId = requestAnimationFrame(renderFollower);
    };

    animFrameId = requestAnimationFrame(renderFollower);

    // Event delegation for interactive hover states
    const interactiveSelector = 'a, button, .project-dark-card, .skill-item-card, .achievement-dark-card, .stat-card, .code-editor-card, .dock-icon-btn, .lang-btn, .astronaut-companion, .hero-3d-core-container, .lab3d-canvas-viewport, .lab3d-toggle-btn, input, textarea';

    const handleMouseOver = (e) => {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.add('cursor-hover');
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      document.body.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <>
      <div id="custom-cursor" ref={cursorRef} className="custom-cursor"></div>
      <div id="custom-cursor-follower" ref={followerRef} className="custom-cursor-follower"></div>
    </>
  );
}

