import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function SpaceCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 800;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Primary 3D Stars Field
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const orangeColor = new THREE.Color(0xff6b00);
    const amberColor = new THREE.Color(0xff9900);
    const whiteColor = new THREE.Color(0xffffff);
    const darkOrangeColor = new THREE.Color(0xcc4400);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Spread across 3D space
      starPositions[i3] = (Math.random() - 0.5) * 2200;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 2200;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 2000;

      // Color variation
      const rand = Math.random();
      let color = whiteColor;
      if (rand < 0.45) {
        color = orangeColor;
      } else if (rand < 0.75) {
        color = amberColor;
      } else if (rand < 0.9) {
        color = darkOrangeColor;
      }

      starColors[i3] = color.r;
      starColors[i3 + 1] = color.g;
      starColors[i3 + 2] = color.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Custom circular soft particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 120, 0, 0.7)');
    gradient.addColorStop(0.8, 'rgba(255, 80, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(canvas);

    const starMaterial = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 2. Large Floating Ambient 3D Cosmic Dust Nodes
    const dustCount = 180;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      dustPositions[i3] = (Math.random() - 0.5) * 1500;
      dustPositions[i3 + 1] = (Math.random() - 0.5) * 1500;
      dustPositions[i3 + 2] = (Math.random() - 0.5) * 1200;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: 14,
      color: 0xff6b00,
      map: particleTexture,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const dustField = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustField);

    // Mouse Parallax & Scroll Depth
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetScrollY = 0;
    let scrollY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.4;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.4;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId = null;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation (LERP)
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      scrollY += (targetScrollY - scrollY) * 0.08;

      camera.position.x = mouseX * 0.5;
      camera.position.y = -mouseY * 0.5;
      camera.position.z = 800 - (scrollY * 0.25) % 1200;

      // Gentle rotation of star fields
      starField.rotation.y = elapsedTime * 0.025;
      starField.rotation.x = elapsedTime * 0.012;

      dustField.rotation.y = -elapsedTime * 0.018;
      dustField.rotation.z = elapsedTime * 0.01;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);

      // Clean up WebGL resources
      starGeometry.dispose();
      starMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="bg-space-wrapper" ref={containerRef}>
      <div className="ambient-orange-orb orb-1"></div>
      <div className="ambient-orange-orb orb-2"></div>
      <div className="ambient-orange-orb orb-3"></div>
    </div>
  );
}
