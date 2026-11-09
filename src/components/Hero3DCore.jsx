import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Hero3DCore({ lang = 'en' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 320;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Group to hold all 3D components
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Outer Wireframe Geodesic Icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(58, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xff6b00,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // 2. Vertex Points on Outer Sphere (Glowing orange nodes)
    const ptsMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 3.5,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const ptsMesh = new THREE.Points(outerGeo, ptsMat);
    coreGroup.add(ptsMesh);

    // 3. Inner Pulsing Core
    const innerGeo = new THREE.OctahedronGeometry(34, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      emissive: 0xff5500,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 4. Orbital Ring (Torus)
    const ringGeo = new THREE.TorusGeometry(78, 1.2, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.85
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    coreGroup.add(ringMesh);

    // Second tilted ring
    const ringGeo2 = new THREE.TorusGeometry(86, 0.8, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff3b00,
      transparent: true,
      opacity: 0.5
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 4;
    ringMesh2.rotation.y = Math.PI / 6;
    coreGroup.add(ringMesh2);

    // 5. Orbiting Swarm Particles
    const swarmCount = 120;
    const swarmPositions = new Float32Array(swarmCount * 3);
    for (let i = 0; i < swarmCount; i++) {
      const i3 = i * 3;
      const radius = 65 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      swarmPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      swarmPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      swarmPositions[i3 + 2] = radius * Math.cos(phi);
    }
    const swarmGeo = new THREE.BufferGeometry();
    swarmGeo.setAttribute('position', new THREE.BufferAttribute(swarmPositions, 3));
    const swarmMat = new THREE.PointsMaterial({
      color: 0xffb703,
      size: 2.8,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const swarmMesh = new THREE.Points(swarmGeo, swarmMat);
    coreGroup.add(swarmMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff6b00, 3, 300);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(100, 100, 100);
    scene.add(dirLight);

    // Mouse Interaction & Drag-to-Rotate Physics
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotVelocity = { x: 0.005, y: 0.008 };
    let targetRot = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        prevMousePos = { x: e.clientX, y: e.clientY };

        rotVelocity.y = deltaX * 0.008;
        rotVelocity.x = deltaY * 0.008;

        targetRot.y += rotVelocity.y;
        targetRot.x += rotVelocity.x;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        rotVelocity.y = deltaX * 0.008;
        rotVelocity.x = deltaY * 0.008;

        targetRot.y += rotVelocity.y;
        targetRot.x += rotVelocity.x;
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 320;
      const h = mount.clientHeight || 320;
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

      // Inertia & Auto-rotation
      if (!isDragging) {
        rotVelocity.x *= 0.95;
        rotVelocity.y *= 0.95;
        coreGroup.rotation.y += 0.007 + rotVelocity.y;
        coreGroup.rotation.x += 0.004 + rotVelocity.x;
      } else {
        coreGroup.rotation.y += rotVelocity.y;
        coreGroup.rotation.x += rotVelocity.x;
      }

      // Pulse inner core
      const pulseScale = 1 + Math.sin(elapsed * 3) * 0.08;
      innerMesh.scale.set(pulseScale, pulseScale, pulseScale);
      innerMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 3) * 0.3;

      // Spin rings in different axes
      ringMesh.rotation.z += 0.012;
      ringMesh2.rotation.z -= 0.008;

      // Swarm swirl
      swarmMesh.rotation.y -= 0.005;
      swarmMesh.rotation.x += 0.003;

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
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);

      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      swarmGeo.dispose();
      swarmMat.dispose();
      renderer.dispose();
      if (domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
    };
  }, []);

  return (
    <div className="hero-3d-core-container">
      <div className="hero-3d-canvas-wrap" ref={mountRef}></div>
      <div className="hero-3d-badge">
        <i className="fas fa-cube"></i>
        <span>{lang === 'id' ? '3D AI CORE • GESER UNTUK ROTASI' : '3D AI CORE • DRAG TO ROTATE'}</span>
      </div>
    </div>
  );
}

