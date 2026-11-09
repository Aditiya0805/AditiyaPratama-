import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function CyberLab3D({ lang }) {
  const mountRef = useRef(null);
  const [activeShape, setActiveShape] = useState('torusKnot');
  const [wireframeMode, setWireframeMode] = useState('wireframe'); // 'wireframe' | 'solid' | 'points'
  const [autoRotate, setAutoRotate] = useState(true);
  const [clickCount, setClickCount] = useState(0);

  // References to communicate with Three.js scene
  const sceneRef = useRef(null);
  const currentMeshRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Group
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const orangeLight = new THREE.PointLight(0xff6b00, 3.5, 400);
    orangeLight.position.set(100, 100, 100);
    scene.add(orangeLight);

    const cyanLight = new THREE.PointLight(0xffa500, 2, 400);
    cyanLight.position.set(-100, -100, -50);
    scene.add(cyanLight);

    // Geometries
    const geometries = {
      torusKnot: new THREE.TorusKnotGeometry(32, 9, 120, 24),
      icosahedron: new THREE.IcosahedronGeometry(45, 2),
      dodecahedron: new THREE.DodecahedronGeometry(44, 1),
      octahedron: new THREE.OctahedronGeometry(46, 2)
    };

    // Helper to build mesh based on mode
    const createObject = (shapeKey, mode) => {
      const geo = geometries[shapeKey] || geometries.torusKnot;

      if (mode === 'points') {
        const mat = new THREE.PointsMaterial({
          color: 0xff8800,
          size: 3.2,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending
        });
        return new THREE.Points(geo, mat);
      }

      if (mode === 'solid') {
        const mat = new THREE.MeshStandardMaterial({
          color: 0x181820,
          emissive: 0xff5500,
          emissiveIntensity: 0.55,
          roughness: 0.15,
          metalness: 0.85,
          wireframe: false
        });
        return new THREE.Mesh(geo, mat);
      }

      // Default: wireframe
      const mat = new THREE.MeshBasicMaterial({
        color: 0xff6b00,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      return new THREE.Mesh(geo, mat);
    };

    let currentMesh = createObject(activeShape, wireframeMode);
    group.add(currentMesh);
    currentMeshRef.current = currentMesh;

    // Interactive Drag to Rotate
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    let vel = { x: 0.006, y: 0.009 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevPos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevPos.x;
        const deltaY = e.clientY - prevPos.y;
        prevPos = { x: e.clientX, y: e.clientY };

        vel.y = deltaX * 0.008;
        vel.x = deltaY * 0.008;

        group.rotation.y += vel.y;
        group.rotation.x += vel.x;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevPos.x;
        const deltaY = e.touches[0].clientY - prevPos.y;
        prevPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        vel.y = deltaX * 0.008;
        vel.x = deltaY * 0.008;

        group.rotation.y += vel.y;
        group.rotation.x += vel.x;
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // Click shockwave pulse
    const onClick = () => {
      setClickCount((c) => c + 1);
      vel.x += (Math.random() - 0.5) * 0.04;
      vel.y += (Math.random() - 0.5) * 0.04;
    };
    domElement.addEventListener('click', onClick);

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 500;
      const h = mount.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId = null;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        vel.x *= 0.95;
        vel.y *= 0.95;

        if (autoRotate) {
          group.rotation.y += 0.008 + vel.y;
          group.rotation.x += 0.005 + vel.x;
        } else {
          group.rotation.y += vel.y;
          group.rotation.x += vel.x;
        }
      }

      // Float gentle bobbing
      group.position.y = Math.sin(elapsed * 2) * 4;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);

      Object.values(geometries).forEach((g) => g.dispose());
      renderer.dispose();
      if (domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
    };
  }, [activeShape, wireframeMode, autoRotate]);

  return (
    <section id="lab3d" className="lab3d-section section-padding">
      <div className="container">
        <div className="section-header-center">
          <div className="section-pre-tag">
            <span>// {lang === 'id' ? 'LAB INTERAKTIF 3D' : '3D INTERACTIVE LAB'}</span>
          </div>
          <h2 className="section-heading-center">
            {lang === 'id' ? (
              <>Eksplorasi <span className="highlight-text">Aset 3D WebGL</span></>
            ) : (
              <>Interactive <span className="highlight-text">3D WebGL Lab</span></>
            )}
          </h2>
          <p className="lab3d-subtitle">
            {lang === 'id'
              ? 'Putar, ganti bentuk geometri, dan eksplorasi simulasi objek 3D interaktif yang ditenagai oleh Three.js.'
              : 'Rotate, switch geometric shapes, and explore interactive real-time 3D simulation powered by Three.js.'}
          </p>
          <div className="section-header-accent-line"></div>
        </div>

        <div className="lab3d-playground-card">
          {/* 3D Canvas Mount Viewport */}
          <div className="lab3d-canvas-viewport" ref={mountRef}>
            <div className="lab3d-canvas-hint">
              <i className="fas fa-arrows-up-down-left-right"></i>
              <span>{lang === 'id' ? 'Klik & Geser untuk Memutar 3D' : 'Click & Drag to Rotate in 3D'}</span>
            </div>

            {clickCount > 0 && (
              <div className="lab3d-pulse-counter">
                <i className="fas fa-bolt"></i> {lang === 'id' ? 'Pulsa Energi' : 'Energy Pulse'}: {clickCount}
              </div>
            )}
          </div>

          {/* Interactive Controls Bar */}
          <div className="lab3d-controls-bar">
            {/* 1. Shape Switcher */}
            <div className="lab3d-control-group">
              <span className="control-group-title">
                <i className="fas fa-shapes"></i> {lang === 'id' ? 'Bentuk Geometri' : 'Geometry Shape'}
              </span>
              <div className="control-btn-row">
                <button
                  type="button"
                  className={`lab3d-toggle-btn ${activeShape === 'torusKnot' ? 'active' : ''}`}
                  onClick={() => setActiveShape('torusKnot')}
                >
                  Torus Knot
                </button>
                <button
                  type="button"
                  className={`lab3d-toggle-btn ${activeShape === 'icosahedron' ? 'active' : ''}`}
                  onClick={() => setActiveShape('icosahedron')}
                >
                  AI Core
                </button>
                <button
                  type="button"
                  className={`lab3d-toggle-btn ${activeShape === 'dodecahedron' ? 'active' : ''}`}
                  onClick={() => setActiveShape('dodecahedron')}
                >
                  Data Crystal
                </button>
                <button
                  type="button"
                  className={`lab3d-toggle-btn ${activeShape === 'octahedron' ? 'active' : ''}`}
                  onClick={() => setActiveShape('octahedron')}
                >
                  Quantum Prism
                </button>
              </div>
            </div>

            {/* 2. Shading / Material Mode */}
            <div className="lab3d-control-group">
              <span className="control-group-title">
                <i className="fas fa-layer-group"></i> {lang === 'id' ? 'Tampilan Render' : 'Render Mode'}
              </span>
              <div className="control-btn-row">
                <button
                  type="button"
                  className={`lab3d-toggle-btn ${wireframeMode === 'wireframe' ? 'active' : ''}`}
                  onClick={() => setWireframeMode('wireframe')}
                >
                  <i className="fas fa-border-all"></i> Wireframe
                </button>
                <button
                  type="button"
                  className={`lab3d-toggle-btn ${wireframeMode === 'solid' ? 'active' : ''}`}
                  onClick={() => setWireframeMode('solid')}
                >
                  <i className="fas fa-cube"></i> Solid Metal
                </button>
                <button
                  type="button"
                  className={`lab3d-toggle-btn ${wireframeMode === 'points' ? 'active' : ''}`}
                  onClick={() => setWireframeMode('points')}
                >
                  <i className="fas fa-braille"></i> Hologram
                </button>
              </div>
            </div>

            {/* 3. Auto Spin Switch */}
            <div className="lab3d-control-group">
              <span className="control-group-title">
                <i className="fas fa-rotate"></i> {lang === 'id' ? 'Rotasi Otomatis' : 'Auto Rotation'}
              </span>
              <div className="control-btn-row">
                <button
                  type="button"
                  className={`lab3d-toggle-btn ${autoRotate ? 'active' : ''}`}
                  onClick={() => setAutoRotate(!autoRotate)}
                >
                  {autoRotate ? (
                    <>
                      <i className="fas fa-pause"></i> {lang === 'id' ? 'Jeda' : 'Pause'}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-play"></i> {lang === 'id' ? 'Putar' : 'Play'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

